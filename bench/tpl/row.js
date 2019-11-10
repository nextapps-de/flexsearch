Mikado.register({
  "t": "tr",
  "i": [
    {
      "t": "td",
      "x": [
        "data.name"
      ]
    },
    {
      "t": "td",
      "s": [
        "'background-color:' + data.color_size"
      ],
      "x": [
        "data.size"
      ]
    },
    {
      "t": "td",
      "s": [
        "'background-color:' + data.color_memory"
      ],
      "x": [
        "data.memory"
      ]
    },
    {
      "t": "td",
      "s": [
        "'background-color:' + data['color_query-single']"
      ],
      "x": [
        "data['query-single']"
      ]
    },
    {
      "t": "td",
      "s": [
        "'background-color:' + data['color_query-multi']"
      ],
      "x": [
        "data['query-multi']"
      ]
    },
    {
      "t": "td",
      "s": [
        "'background-color:' + data['color_not-found']"
      ],
      "x": [
        "data['not-found']"
      ]
    },
    {
      "t": "td",
      "i": {
        "t": "b",
        "x": [
          "data.index"
        ]
      },
      "s": [
        "'background-color:' + data.color_index"
      ]
    },
    {
      "t": "td",
      "i": {
        "t": "b",
        "x": [
          "data.score"
        ]
      },
      "s": [
        "'background-color:' + data.color_score"
      ]
    }
  ],
  "d": false,
  "n": "row",
  "v": "0.7.44"
});