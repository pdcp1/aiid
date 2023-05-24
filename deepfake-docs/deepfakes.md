# DFID Development Process

This document contains information on the OSU Capstone Team's design and development process for the DFID. For setup instructions, architecture, and how to contribute, take a look at [README.md](../README.md)

## Schedule and Roadmap

This has been the development plan for our Deepfake Database's features, broken down by month:

* **Sep 2022 - Dec 2022**: Planning and determining requirements.
* **Jan 2023**: Front-end design mocks (below), backend feature development.
* **Feb 2023 - Mar 2023**: Separate development of front-end video player and submission form, and database-level video URL capture features.
* **Apr 2023**: Feature integration within the team, and deepfake incident data collection.
* **May 2023**: Integration of video features with AIID in a [pull request](https://github.com/responsible-ai-collaborative/aiid/pull/1979), and bug fixes.

Our project's requirements changed during the development process, and we delivered on the AIID team's most pressing needs over the course of the development process:

* Integrate video storage and playback.
* Collect a [seed datasest](https://drive.google.com/file/d/118pOK2x0fccbUUSqV5X5Mz9ynHfLlAyw/view?usp=sharing) of deepfake incidents.
* Create a Deepfake Incident Database website with these capabilities.

However, there still remain some features that remain unrealized, and are in the next steps of this project. The **roadmap** for these is below, ordered by the priority of these features. We will offer assistance and contact with the AIID team in developing these.

1. Finish integrating video features with AIID, as per this [pull request](https://github.com/responsible-ai-collaborative/aiid/pull/1979).
1. Integrate Cypress.js unit tests for video capabilities with the AIID team.
1. Develop a deepfake taxonomy based on our seed data.
1. Develop visualizations based on our deepfake taxonomy.
1. Assist the AIID team with their federation process, of converting the AIID repository to one for setting up general-purpose incident databases.

## Mock Front-End Designs

![][https://raw.githubusercontent.com/ShaurGaur/aiid/CodeFreeze/deepfake-docs/mock-submission.jpg]

This is the front-end mock design for the video URL feature in the submission form. We have successfully implemented this, and added a feature which retrieves the thumbnail of the provided video into a Cloudinary image store. This image can later be used as a fallback for the video in the event the deepfake video gets removed from the platform.

![][https://raw.githubusercontent.com/ShaurGaur/aiid/CodeFreeze/deepfake-docs/mock-incident.jpg]

This is the front-end mock design for the Video Player in the Incident page. We have implemented the video player card for this page, as well as a video player for each report.

![][https://raw.githubusercontent.com/ShaurGaur/aiid/CodeFreeze/deepfake-docs/mock-discover.jpg]

This is the front-end mock design for the Video Player in the Discover page. We have implemented the video player in the Details card of this page, and purposefully omitted it from the other views for format reasons. The tags in the bottom have not been developed yet due to a lack of a deepfake taxonomy at the moment.

## Response to Code Walkthrough Feedback

Desmond and Jingming did not receive any concerns in their Code Walkthrough feedback.

Shaurya received one general concern about the navigability of the website's front-end. However, our project partner required minimal changes to the AIID website's structure, and asked us to only add necessary elements for deepfake capabilities. Due to this priority from our project , and the lack of a specific concern in the front-end to change, we have purposefully chosen not to respond to any concerns.

## Credits

OSU Capstone Project Team in Corvallis, 2022 - 2023:

* Shaurya Gaur - [shauryavrat@live.com](mailto:shauryavrat@live.com)
* Desmond Virasak-Holmes - [desmondholmes8219@gmail.com](mailto:desmondholmes8219@gmail.com)
* Jingming Xia - [xiajingming1993104@gmail.com](mailto:xiajingming1993104@gmail.com)

ECampus Capstone Team (developed in parallel):

* Nihal Damahe
* Jaegeun (Aiden) Oh

We'd like to thank our project partner **Sean McGregor** ([contact@seanbmcgregor.com](contact@seanbmcgregor.com)) from the Responsible AI Collaborative for his guidance throughout the project duration.