const { exec } = require('child_process')
const {readIn, writeOut} = require('./src/read-write.js')
const Vehicle = require('./src/Vehicle.js')

main()
exec('zip -r ./out/source.zip index.js package.json test src')

function main () {
  ['a_example', 'b_should_be_easy', 'c_no_hurry', 'd_metropolis', 'e_high_bonus']
    .slice(3, 4)
    .forEach(input => {
      solve(input)
    })
}

async function solve (input) {
  const file = await readIn(`${input}.in`)
  const [head, ...lines] = file.trim().split('\n')
  const [R, C, F, N, B, T] = head.split(' ')
  const rides = lines.map((line, index) => {
    const arr = line.split(' ')
    return {
      rideFrom: arr.slice(0, 2).map(n => Number.parseInt(n)),
      rideTo: arr.slice(2, 4).map(n => Number.parseInt(n)),
      earliestStart: Number.parseInt(arr[4]),
      latestFinish: Number.parseInt(arr[5]),
      id: index,
      finish: false,
      assigned: false
    }
  })

  const vehicles = []
  for (let i = 0; i < F; i++) {
    vehicles.push(new Vehicle(i))
  }
  simulation(T, rides, vehicles)
  console.log('rides finish', rides.filter(ride => ride.finish).length)
  console.log('rides unfinish', rides.filter(ride => !ride.finish).length)
  console.log('rides total', N)
  const results = vehicles.map(vehicle => {
    return [vehicle.rides.length, ...vehicle.rides.map(a => a.id)].join(' ')
  }).join('\n')
  writeOut(`${input}.out`, results)
}

function simulation (T, rides, vehicles) {
  for (let tick = 0; tick < T; tick++) {
    vehicles.map(vehicle => {
      vehicle.run()
      if (!vehicle.assigned) {
        vehicle.selectBestRide(rides)
      }
    })
  }
}
