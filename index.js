const {readIn, writeOut} = require('./src/read-write.js')
const { exec } = require('child_process')

main()

exec('zip -r ./out/source.zip index.js package.json test src')

async function main () {
  ['a_example', 'b_should_be_easy', 'c_no_hurry', 'd_metropolis', 'e_high_bonus'].forEach(input => {
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
      rideFrom: arr.slice(0, 2),
      rideTo: arr.slice(2, 4),
      earliestStart: arr[4],
      latestFinish: arr[5],
      id: index
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
    for (const ride of rides) {
      if (ride.earliestStart < tick) {
        continue
      }

      vehicules.sort((a, b) => {
        if (a.assigned) {
          return 9999999999999999
        }
        return distance(ride.rideFrom, a.coords) - (ride.rideFrom, b.coords)
      })

      vehicules = vehicules.map((v) => {
        v.distanceParcouru = distance(v.coords, ride.rideFrom) + distance(ride.rideFrom, ride.rideTo)
        return v
      })

      if (!vehicules.length) {
        break
      } else {
        ride.assigned = true
        vehicules[0].assigned = true
        vehicules[0].rides.push(ride)
        vehicules[0].coords = ride.rideTo
      }
    }

    vehicules.map((v) => {
      v.assigned = false
      return v
    })

    tick = vehicules.sort((va, vb) => {
      return vb.distanceParcouru - va.distanceParcouru
    })[0]

    rides = rides.filter(r => !r.assigned)

    if (rides.length) {
      selection()
    }
  }

  selection(vehicules)
  let sortie = [...vehicules].map((v) => {
    return v.rides.length + ' ' + v.rides.map(a => a.id).join(' ')
  })

  writeOut(`${input}.out`, sortie.join('\n'))
}
