from dataset import df
from insights import build_insights_for_asset
from decision import make_decision
from llm_explainer import explain
import datetime 

def run_full_pipeline(asset):

    print(f"\nRunning full analysis for {asset}...\n")

    # 1️⃣ Load data
    series = df[asset].dropna()

    # 2️⃣ Market insights (trend, volatility, etc.)
    market_insights = build_insights_for_asset(asset)

    # 3️⃣ Strategy backtest
    # df_bt, strategy_metrics = run_backtest(series)
    strategy_metrics = {"sharpe": 0.5, "max_drawdown": -0.1, "total_return": 0.2}

    # 4️⃣ Decision engine
    decision, score = make_decision(market_insights, strategy_metrics)

    # 5️⃣ Combine report
    full_report = {
        "market": market_insights,
        "strategy": strategy_metrics,
        "decision": decision,
        "score": score
    }

    # 6️⃣ LLM explanation
    explanation = explain(full_report)

    return full_report, explanation


if __name__ == "__main__":

    asset = "TATASTEEL"   # change as needed
    output_path = "llm_analysis.txt"  # output file path

    report, explanation = run_full_pipeline(asset)

    print("\n=== FINAL REPORT ===\n")
    print(report)

    print("\n=== LLM EXPLANATION ===\n")
    print(explanation)
    with open(output_path, "a", encoding="utf-8") as f:
        now = datetime.datetime.now()
        f.write(f"\n\nAnalysis Date: {now.strftime('%Y-%m-%d /%H:%M:%S')}")
        f.write("\n\n" + "="*80 + "\n")  # Add separator for better readability
        f.write(explanation)
        f.flush()
    
    print(f"Explanation has been saved to: {output_path}")