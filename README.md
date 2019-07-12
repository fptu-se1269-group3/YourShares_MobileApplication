# Yourshares_MobileApplication
> Mobile client side for `YourShares` application.

## Table of Contents
* [Overall Description](#Overall-Description)
* [Key features](#Key-features)
* [Getting started](#Getting-started)
    * [Design and Structure](#Design-and-Structure)
    * [Installation](#Installation)
* [License](#License)

## Overall Description

`YourShares` is an application that allows startup company to watch their shares which they published and manage them through each of the round changes. Besides, it also allows shareholders to keep track of their shares such as bonus shares status, holding section together with the company.

Read more about this project at [here](https://sites.google.com/fpt.edu.vn/yourshares)

## Key features

* Manage company shares data, including their amount, holding percent, changes they've made.
* View and keep track of shareholder status.
* Automatic evaluate how the changes through each company's round affect to shareholders, such as the holding section and shares value
* Keep track and analyze shareholder's transaction.

## Getting started

### Design and Structure

* Component-based design with react-native
* Managed life cycle using Expo SDK 33.0
* Restful Web Api with ASP.NET Core [here](https://github.com/fptu-se1269-group3/YourShares_ServerAPI)

### Running application

You can find this application on Expo [here](https://expo.io/@mtu_ng/your-shares). Download Expo client app and scan project's QR code to get started.

Alternative, if you want to modify the source code and running, feel free to clone this repository. From your command line:

```shell=
# Clone this repository
git clone https://github.com/fptu-se1269-group3/YourShares_MobileApplication.git

# Install dependencies 
yarn

# Or with npm
# Notes: We're using yarn, so there's no lock file for npm, 
# which can cause some issue in dependencies package versions. 
# Try using yarn if you run into any dependencies version issue.
npm install

# Install expo-cli tool
yarn global add expo-cli
# Or npm
npm install -g expo-cli

# Up and running
yarn start
```

## License

This project is licensed  under MIT open source license.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)