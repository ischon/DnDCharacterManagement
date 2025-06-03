export const formatScore = score => {
  return score !== 0 ? (score > 0 ? '+' : '') + score : '-'
}

// 1 lb = 0.45359237 kg
export const formatWeight = pounds => {
  if (pounds === 0) return '-'

  const weight = [[pounds], [pounds * 0.45359237]]

  // pounds and ounces
  if (weight[0][0] < 0.1) {
    // pounds to ounces conversion (times 16)
    weight[0][0] = weight[0][0] * 16
    weight[0][2] = 'oz'
  } else {
    weight[0][2] = 'lb'
  }

  // kilo's and grams
  if (weight[1][0] < 0.1) {
    // kilograms to grams conversion (times 1000)
    weight[1][0] = weight[1][0] * 1000
    weight[1][2] = 'g'
  } else {
    weight[1][2] = 'kg'
  }

  for (let i = 0; i < weight.length; i++) {
    weight[i][1] = weight[i][0]
    if (weight[i][1] % 1 !== 0) {
      weight[i][1] = weight[i][1].toFixed(1).replace('.', ',')
      if (weight[i][1].endsWith(',0')) {
        weight[i][1] = weight[i][1].slice(0, -2)
      }
    }
  }

  return `${weight[0][1]} ${weight[0][2]} | ${weight[1][1]} ${weight[1][2]}`
}

export const formatLength = foot => {
  if (foot === 0) return '-'

  const length = [[foot], [foot * 0.3048]]

  // pounds and ounces
  if (length[0][0] < 1) {
    // feet to inch conversion (times 12)
    length[0][0] = length[0][0] * 12
    length[0][2] = 'in'
  } else {
    length[0][2] = 'ft'
  }

  // kilo's and grams
  if (length[1][0] < 1) {
    // meter to centimeter conversion (times 100)
    length[1][0] = length[1][0] * 100
    length[1][2] = 'cm'
  } else {
    length[1][2] = 'm'
  }

  for (let i = 0; i < length.length; i++) {
    length[i][1] = length[i][0]
    if (length[i][1] % 1 !== 0) {
      length[i][1] = length[i][1].toFixed(1).replace('.', ',')
      if (length[i][1].endsWith(',0')) {
        length[i][1] = length[i][1].slice(0, -2)
      }
    }
  }

  return `${length[0][1]} ${length[0][2]} | ${length[1][1]} ${length[1][2]}`
}
