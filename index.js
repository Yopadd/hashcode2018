const {readIn, writeOut} = require('./src/read-write.js')
const { exec } = require('child_process')

main()

exec('zip -r ./out/source.zip index.js package.json test src')

async function main () {
  ['a_example', 'b_should_be_easy', 'c_no_hurry', 'd_metropolis', 'e_high_bonus']
    // .slice(0, 1)
    .forEach(input => {
      example(input)
    })
}

async function example (input) {
  const file = await readIn(`${input}.in`)
  const [head, ...lines] = file.trim().split('\n')
  const [R, C, F, N, B, T] = head.split(' ')
  let rides = lines.map((line, index) => {
    const arr = line.split(' ')
    return {
      rideFrom: arr.slice(0, 2).map(n => Number.parseInt(n)),
      rideTo: arr.slice(2, 4).map(n => Number.parseInt(n)),
      earliestStart: Number.parseInt(arr[4]),
      latestFinish: Number.parseInt(arr[5]),
      id: Number.parseInt(index)
    }
  })

  let vehicules = []
  for (var i = 0; i < F; i++) {
    vehicules.push({id: i, coords: [0, 0], assigned: false, rides: []})
  }

  let distance = (a, b) => {
    return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])
  }

  let tick = 0
  const selection = () => {
    for (const index in rides) {
      if (!vehicules.filter(v => !v.assigned).length) {
        break
      } else {
        rides[index].assigned = true
        vehicules[0].assigned = true
        vehicules[0].rides.push(rides[index])
        vehicules[0].coords = rides[index].rideTo
      }

      if (rides[index].earliestStart < tick) {
        continue
      }

      vehicules.sort((a, b) => {
        if (a.assigned) {
          return 9999999999999999
        }
        return distance(rides[index].rideFrom, a.coords) - distance(rides[index].rideFrom, b.coords)
      })

      vehicules = vehicules.map((v) => {
        v.distanceParcouru = distance(v.coords, rides[index].rideFrom) + distance(rides[index].rideFrom, rides[index].rideTo)
        return v
      })
    }

    vehicules.map((v) => {
      v.assigned = false
      return v
    })

    tick += vehicules.sort((va, vb) => {
      return vb.distanceParcouru - va.distanceParcouru
    })[0].distanceParcouru

    rides = rides.filter(r => !r.assigned)

    if (rides.length) {
      selection()
    }
  }

  selection(vehicules)
  let sortie = [...vehicules].map((v) => {
    return v.rides.length + ' ' + v.rides.map(a => a.id).join(' ')
  })

  console.log(sortie)
  writeOut(`${input}.out`, sortie.join('\n'))
}
