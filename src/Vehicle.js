const distance = require('./distance.js')

class Vehicle {
  constructor (id) {
    this.id = id
    this.position = [0, 0]
    this.rides = []
    this.distanceTo = 0
    this.assigned = false
  }

  run (tick) {
    if (this.distanceTo === 0) {
      if (this.currentRide) {
        this.currentRide.finish = true
      }
      this.assigned = false
    } else {
      this.distanceTo--
    }
  }

  assigneRide (ride) {
    this.rides.push(ride)
    this.distanceTo = distance(this.position, ride.rideFrom) + distance(ride.rideFrom, ride.rideTo)
    this.position = ride.rideTo
    ride.assigned = true
    this.assigned = true
  }

  selectBestRide (rides) {
    rides = rides.filter(ride => !ride.assigned)
    let bestRide = rides[0]
    for (const ride of rides) {
      const diff = distance(this.position, bestRide.rideFrom) - distance(this.position, ride.rideFrom)
      if (diff > 0) {
        bestRide = ride
      }
    }
    if (bestRide) {
      this.assigneRide(bestRide)
    }
  }

  get currentRide () {
    return this.rides[this.rides.length - 1]
  }
}

module.exports = Vehicle
