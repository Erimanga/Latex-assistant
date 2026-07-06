/**
 * All built-in LaTeX snippet definitions.
 */

import type { Snippet } from "../types/snippet";

function builtin(trigger: string, replacement: string, description: string, flags = "mw", priority = 10): Snippet {
    return { id: `builtin:${trigger}`, trigger, replacement, description, flags, priority, isBuiltin: true };
}

export const BUILTIN_SNIPPETS: Snippet[] = [
    builtin("cases", "\\begin{cases}\n\t#{1:a} & #{2:b} \\\\\n\t#{3:c} & #{4:d}\n\\end{cases}", "Cases 分段函数 2×2"),
    builtin("matrix", "\\begin{matrix}\n\t#{1:a} & #{2:b} \\\\\n\t#{3:c} & #{4:d}\n\\end{matrix}", "Matrix 矩阵 2×2"),
    builtin("bmatrix", "\\begin{bmatrix}\n\t#{1:a} & #{2:b} \\\\\n\t#{3:c} & #{4:d}\n\\end{bmatrix}", "Bracket Matrix 方括号矩阵"),
    builtin("pmatrix", "\\begin{pmatrix}\n\t#{1:a} & #{2:b} \\\\\n\t#{3:c} & #{4:d}\n\\end{pmatrix}", "Paren Matrix 圆括号矩阵"),
    builtin("vmatrix", "\\begin{vmatrix}\n\t#{1:a} & #{2:b} \\\\\n\t#{3:c} & #{4:d}\n\\end{vmatrix}", "Det Matrix 行列式"),
    builtin("aligned", "\\begin{aligned}\n\t#{1} &= #{2} \\\\\n\t&= #{3}\n\\end{aligned}", "Aligned 多行对齐"),
    builtin("array", "\\begin{array}{#{1:cc}}\n\t#{2:a} & #{3:b} \\\\\n\t#{4:c} & #{5:d}\n\\end{array}", "Array 阵列"),
    builtin("equation", "\\begin{equation}\n\t#{1}\n\\end{equation}", "Equation 编号公式"),
    builtin("gather", "\\begin{gather}\n\t#{1} \\\\\n\t#{2}\n\\end{gather}", "Gather 居中多行"),
    builtin("align", "\\begin{align}\n\t#{1} &= #{2} \\\\\n\t#{3} &= #{4}\n\\end{align}", "Align 对齐多行"),
    builtin("split", "\\begin{split}\n\t#{1} &= #{2} \\\\\n\t&= #{3}\n\\end{split}", "Split 拆分公式"),
    builtin("frac", "\\frac{#{1:num}}{#{2:den}}", "Fraction 分数"),
    builtin("sqrt", "\\sqrt{#{1}}", "Square Root 根号"),
    builtin("sum", "\\sum_{#{1:i=1}}^{#{2:n}} #{3}", "Sum 求和"),
    builtin("int", "\\int_{#{1:0}}^{#{2:\\infty}} #{3} \\,d#{4:x}", "Integral 积分"),
    builtin("iint", "\\iint_{#{1}}^{#{2}} #{3} \\,d#{4}", "Double Integral 二重积分"),
    builtin("lim", "\\lim_{#{1:x \\to 0}} #{2}", "Limit 极限"),
    builtin("prod", "\\prod_{#{1:i=1}}^{#{2:n}} #{3}", "Product 连乘"),
    builtin("text", "\\text{#{1}}", "Text 正文"),
    builtin("stackrel", "\\stackrel{#{1:above}}{#{2:below}}", "Stack 上下堆叠"),
    builtin("alpha", "\\alpha", "α Alpha", "m", 5),
    builtin("beta", "\\beta", "β Beta", "m", 5),
    builtin("gamma", "\\gamma", "γ Gamma", "m", 5),
    builtin("delta", "\\delta", "δ Delta", "m", 5),
    builtin("epsilon", "\\epsilon", "ε Epsilon", "m", 5),
    builtin("theta", "\\theta", "θ Theta", "m", 5),
    builtin("lambda", "\\lambda", "λ Lambda", "m", 5),
    builtin("omega", "\\omega", "ω Omega", "m", 5),
    builtin("phi", "\\phi", "φ Phi", "m", 5),
    builtin("sigma", "\\sigma", "σ Sigma", "m", 5),
    builtin("binom", "\\binom{#{1:n}}{#{2:k}}", "Binomial 二项式"),
    builtin("bar", "\\bar{#{1}}", "Bar 上划线"),
    builtin("hat", "\\hat{#{1}}", "Hat 帽子"),
    builtin("vec", "\\vec{#{1}}", "Vector 向量"),
    builtin("dot", "\\dot{#{1}}", "Dot 点"),
    builtin("tilde", "\\tilde{#{1}}", "Tilde 波浪线"),
    builtin("substack", "\\substack{#{1}}", "Substack 多行下标"),
    builtin("underbrace", "\\underbrace{#{1:expr}}_{#{2:text}}", "Underbrace 下括号"),
    builtin("overbrace", "\\overbrace{#{1:expr}}^{#{2:text}}", "Overbrace 上括号"),
];
