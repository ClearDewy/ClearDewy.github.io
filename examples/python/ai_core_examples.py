"""Deterministic, dependency-free checks used by the AI learning path."""

from math import exp, sqrt


def matrix_multiply(left, right):
    assert left and right and len(left[0]) == len(right)
    return [
        [sum(left[i][k] * right[k][j] for k in range(len(right))) for j in range(len(right[0]))]
        for i in range(len(left))
    ]


def stable_softmax(row):
    peak = max(row)
    values = [exp(value - peak) for value in row]
    total = sum(values)
    return [value / total for value in values]


def causal_attention(queries, keys, values):
    dimension = len(queries[0])
    scores = [
        [sum(q[d] * k[d] for d in range(dimension)) / sqrt(dimension) for k in keys]
        for q in queries
    ]
    for query_index, row in enumerate(scores):
        for key_index in range(query_index + 1, len(row)):
            row[key_index] = float("-inf")
    weights = [stable_softmax(row) for row in scores]
    output = [
        [sum(weights[i][j] * values[j][d] for j in range(len(values))) for d in range(len(values[0]))]
        for i in range(len(queries))
    ]
    return weights, output


def main():
    left = [[1, 2, 3], [4, 5, 6]]
    right = [[7, 8], [9, 10], [11, 12]]
    assert matrix_multiply(left, right) == [[58, 64], [139, 154]]

    batch, tokens, channels, heads = 2, 4, 8, 2
    head_dimension = channels // heads
    assert batch * tokens * channels == batch * tokens * heads * head_dimension

    x, y, weight, epsilon = 2.0, 6.0, 1.0, 1e-5
    loss = lambda value: (value * x - y) ** 2
    numeric_gradient = (loss(weight + epsilon) - loss(weight - epsilon)) / (2 * epsilon)
    analytic_gradient = 2 * (weight * x - y) * x
    assert abs(numeric_gradient - analytic_gradient) < 1e-6
    new_weight = weight - 0.1 * analytic_gradient
    assert abs(loss(new_weight) - 0.64) < 1e-12

    queries = keys = [[1.0, 0.0], [0.0, 1.0]]
    values = [[2.0, 0.0], [0.0, 4.0]]
    attention_weights, output = causal_attention(queries, keys, values)
    assert attention_weights[0] == [1.0, 0.0]
    assert all(abs(sum(row) - 1.0) < 1e-12 for row in attention_weights)
    assert output[0] == [2.0, 0.0]
    assert abs(output[1][0] - 0.6604769) < 1e-6
    assert abs(output[1][1] - 2.6790462) < 1e-6

    print("all ai core examples passed")


if __name__ == "__main__":
    main()
