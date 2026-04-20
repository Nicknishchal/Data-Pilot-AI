import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
import pandas as pd

class ChartService:
    def _fig_to_base64(self, fig):
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        buf.seek(0)
        img_str = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        return img_str

    def profile_data(self, df: pd.DataFrame):
        """Strict Data Understanding Layer. Flags columns unsuitable for visualization."""
        profile = {}
        for col in df.columns:
            unique_count = df[col].nunique()
            total_count = len(df[col])
            uniqueness = unique_count / total_count if total_count > 0 else 0
            
            # Identify Column Types
            is_numeric = pd.api.types.is_numeric_dtype(df[col])
            is_datetime = pd.api.types.is_datetime64_any_dtype(df[col]) or 'date' in col.lower() or 'time' in col.lower()
            
            # Rule 4: Useless columns (IDs or >90% unique values)
            is_useless = col.lower().endswith('_id') or col.lower() == 'id' or uniqueness > 0.9
            
            profile[col] = {
                "type": "datetime" if is_datetime else ("numeric" if is_numeric else "categorical"),
                "is_useless": is_useless,
                "uniqueness": uniqueness,
                "unique_values": unique_count,
            }
        return profile

    def prepare_dynamic_data(self, df: pd.DataFrame, config: dict):
        """Task 2, 5, 6: Intelligent Aggregation & Validation Layer."""
        try:
            chart_type = config.get("chart_type", "bar")
            x_axis = config.get("x") or config.get("x_axis")
            y_axis = config.get("y") or config.get("y_axis")
            aggregation = config.get("aggregation", "none")

            if x_axis not in df.columns:
                return {"error": f"Column '{x_axis}' not found in dataset."}

            working_df = df.copy()

            # Rule 1: MANDATORY TIME SERIES AGGREGATION
            is_time_series = 'date' in x_axis.lower() or 'time' in x_axis.lower() or pd.api.types.is_datetime64_any_dtype(working_df[x_axis])
            
            if is_time_series:
                try:
                    working_df[x_axis] = pd.to_datetime(working_df[x_axis])
                    # Ensure aggregation is set for time series if not provided
                    if aggregation == 'none':
                        aggregation = 'count'
                except:
                    is_time_series = False # Fallback if cast fails

            # Aggregation Logic
            if aggregation == "count":
                chart_data = working_df.groupby(x_axis).size().reset_index(name='value')
            elif aggregation == "sum" and y_axis in working_df.columns:
                chart_data = working_df.groupby(x_axis)[y_axis].sum().reset_index(name='value')
            elif aggregation == "avg" and y_axis in working_df.columns:
                chart_data = working_df.groupby(x_axis)[y_axis].mean().reset_index(name='value')
            else:
                # Default fallback aggregation if none specified but required (e.g. time series)
                if is_time_series or y_axis is None:
                    chart_data = working_df.groupby(x_axis).size().reset_index(name='value')
                else:
                    # Still need some form of grouping to avoid duplicates/raw plots
                    chart_data = working_df.groupby(x_axis)[y_axis].first().reset_index(name='value')

            # Ensure time series are sorted chronologically
            if is_time_series:
                chart_data = chart_data.sort_values(x_axis)

            # Task 5: Clutter Control & Specific Limits (Top X)
            limit = config.get("limit")
            if limit and str(limit).isdigit():
                chart_data = chart_data.sort_values('value', ascending=False).head(int(limit))
            elif len(chart_data) > 10:
                chart_data = chart_data.sort_values('value', ascending=False).head(10)

            # Task 6: Meaningful Data Check
            if chart_data.empty or (len(chart_data) == 1 and aggregation != "none"):
                return {"error": "This visualization is not meaningful for the selected data (too few segments)."}

            # Format for Chart.js
            return {
                "labels": chart_data[x_axis].astype(str).tolist(),
                "datasets": [{
                    "label": config.get("title", "Insight"),
                    "data": chart_data['value'].tolist(),
                    "backgroundColor": [
                        'rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)',
                        'rgba(75, 192, 192, 0.7)', 'rgba(255, 206, 86, 0.7)',
                        'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
                        'rgba(34, 197, 94, 0.7)', 'rgba(99, 102, 241, 0.7)',
                        'rgba(236, 72, 153, 0.7)', 'rgba(245, 158, 11, 0.7)'
                    ],
                    "borderColor": 'rgba(255, 255, 255, 0.1)',
                    "borderWidth": 2
                }]
            }
        except Exception as e:
            return {"error": f"Data processing failed: {str(e)}"}

    def generate_histogram(self, df: pd.DataFrame):
        numeric_cols = [c for c in df.select_dtypes(include=['number']).columns if not (c.lower().endswith('_id') or c.lower() == 'id')]
        if not numeric_cols: return ""
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.histplot(df[numeric_cols[0]], kde=True, ax=ax)
        ax.set_title(f"Distribution of {numeric_cols[0]}")
        return self._fig_to_base64(fig)

    def generate_heatmap(self, df: pd.DataFrame):
        numeric_df = df.select_dtypes(include=['number']).drop(columns=[c for c in df.columns if c.lower().endswith('_id') or c.lower() == 'id'], errors='ignore')
        if numeric_df.empty or len(numeric_df.columns) < 2: return ""
        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm', fmt=".2f", ax=ax)
        ax.set_title("Correlation Heatmap")
        return self._fig_to_base64(fig)

chart_service = ChartService()
