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

    def generate_histogram(self, df: pd.DataFrame):
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) == 0:
            return ""
        
        # Plot first numeric column histogram
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.histplot(df[numeric_cols[0]], kde=True, ax=ax)
        ax.set_title(f"Distribution of {numeric_cols[0]}")
        
        return self._fig_to_base64(fig)

    def generate_heatmap(self, df: pd.DataFrame):
        numeric_df = df.select_dtypes(include=['number'])
        if numeric_df.empty or len(numeric_df.columns) < 2:
            return ""
        
        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm', fmt=".2f", ax=ax)
        ax.set_title("Correlation Heatmap")
        
        return self._fig_to_base64(fig)

chart_service = ChartService()
