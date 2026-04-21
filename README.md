# RideShareX

## Description

RideShareX is a robust and feature-rich ride-sharing service built with Java, designed to simplify urban commuting. Our platform seamlessly connects riders with nearby drivers, offering real-time tracking, secure payments, and a user-friendly experience. With integrated mapping services, users can track rides in real-time, ensuring a smooth and efficient journey from start to finish

## Key Features:

- **Real-Time:** Tracking: Track your ride and driver's location in real-time using integrated mapping services.
- **Smart Matching:** Efficiently match riders with available drivers based on proximity and ride preferences.
- **Transparent Fare Calculation:** Estimate fares based on distance, duration, and traffic conditions before confirming the ride.
- **Secure Payments:** Process payments securely through multiple payment methods, ensuring a hassle-free transaction experience.
- **User Reviews:** Rate drivers and leave reviews to maintain a high-quality ride experience for all users.

## Technologies Used:

Java, Spring Framework, Hibernate, Google Maps API, MySQL, HTML/CSS, Javascript

## How to Contribute:

We welcome contributions from developers of all levels! Check out our [Contribution Guidelines](./docs/CONTRIBUTION.md) to get started. Whether you're passionate about frontend design, backend development, or testing, there's a place for you in our community.

## Installation and usage:

```bash
# clone the repo
git clone https://github.com/mahekpreet13/RideShareX.git

cd RideShareX
code .

cd RideShareX

mvn clean install

cp src/resources/application.properties.template src/resources/application.properties

# open terminal to run a sql instance
mysql -u root -p
create database ridesharex;
# edit the application.properties file to add password and all
# also add ors.api.key=YOUR_API_KEY

mvn spring-boot:run

# start frontend -- open new terminal

cd ridesharex-frontend

npm i

npm start

```

> Your frontend is running on [http://localhost:3000](http://localhost:3000)
> Your backend is running on [http://localhost:8080](http://localhost:8080)
