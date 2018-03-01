const {readIn, writeOut} = require('./src/read-write.js')
const { exec } = require('child_process')

main()

exec('zip -r ./out/source.zip index.js package.json test src')

async function main() {
  await example()
}

async function example() {
  const file = await readIn('example.in')
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
  });

  const coord = [0, 0]
  let vehicules = [];
  for (var i = 1; i <= F; i++) {
    vehicules.push({id: i - 1, coords: [0, 0], assigned: false, rides: []});
  }

  let run = () => {
    console.log('RUN');
  }

  let distance = (a, b) => {
    return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])
  };

  selection = () => {
    let potentialVehicules;
    rides.forEach((ride, index) => {
      console.log('> NOUVEAU RIDE');
      let nearest = {distance: 0, vehicule: null};
      // let nonAssignedVehicules = vehicules.filter(v => !v.assigned);
      vehicules
        .sort((a, b) => {
          if(a.assigned){
            return 9999999999999999;
          }
          return distance(ride.rideFrom, a.coords) - (ride.rideFrom, b.coords);
        });
      vehicules = vehicules.map((v) => {
        v.distanceParcouru = distance(v.coords, ride.rideFrom) + distance(ride.rideFrom, ride.rideTo);
        return v;
      });
      if (!vehicules.length) {
        vehicules.map((v) => {
          v.assigned = false;
          return v;
        });
        return true;
      } else {
        ride.assigned = true;
        vehicules[0].assigned = true;
        vehicules[0].rides.push(ride);
        vehicules[0].coords = ride.rideTo;
      }
    });

    rides = rides.filter(r => !r.assigned);
    if (rides.length) {
      selection();
    }
  };


  selection(vehicules);
  console.log(vehicules);
  let sortie = [...vehicules].map((v) => {
    return v.rides.length + ' ' + v.rides.map(a => a.id).join(' ')
  });
  writeOut('example.out', sortie.join('\n'))


  // let tick =

  // rides.forEach((ride) => {
  //   ride.vehicule.coords = [ride.vehicule.coords[0] + 1, ride.vehicule.coords[1] + 1];
  // });
  //
  // for (var i=1; i<= T; i++){
  //   rides.forEach((ride) => {
  //
  //   });
  // }


}
