# Scio Assignment

Create a prototype application for real-time monitoring of student group progress by the teacher.

## Functionality:

- **Registration / login with Google account, RBAC.**

- **After login, ability to create a new group and tabular overview of existing groups.** When creating a group, the user fills in only its name (e.g., "A2 - quadratic equations 1") and description of the goal (e.g., "solve independently 3 different quadratic equations of type ax^2 + bx + c" using discriminant).

- **A QR code is generated for the group**, which anyone can use to enter the group, one device can enter the group only once (localstorage), after entry the user enters their nickname (e.g., "John Doe").

- **User in the group works through text chat.** After entry, they are welcomed with a message that describes the goal they need to achieve.

- **On screen, the user always sees their progress in achieving the goal**, or goals - goals are of type "completed/not completed" (e.g., "explain the difference between linear and quadratic equation"), or "completed %" (e.g., "solve 3 equations") - completed 0%, 33%, 66%, 100%.

- **Goals with percentages have a progress bar, yes/no goals have a checkmark.**

- **The system guides the student to solve tasks**, if they're not working, it first shows a warning (e.g., in the form of an indicator under a message that is not relevant to the goals), then alerts the teacher (described below).

- **Messages that solve the goal or increase progress are highlighted in the conversation**, for example with a green border.

- **The teacher can monitor student progress in real time**, sees their progress in achieving goals and if any student needs help, sees an indicator next to them, which can be marked as resolved.

## Technologies:

Nuxt, WebSocket (via Nitro), Postgres/Supabase, Drizzle, Tailwind, UI components as desired. AI libraries as desired.

## Bonus Challenges:

- **The teacher can expand student details** (inline on the page), where they see key messages that lead to progress in assigned goals. Can be displayed as question-solution pairs, or aggregation of multiple messages that solve the task comprehensively.

- **Chat interface for students supports display of mathematical expressions and code examples.**

- **Student can dictate assignments by voice.**

When creating the solution, you can use AI to any extent at your own discretion. We only ask for a statement of which systems (e.g., Cursor) were used and which parts are solved this way (e.g., "the whole thing was written by chatgpt"). Please include a note on how much time you spent creating the solution.

## Submission:

We prefer demo deployment on Vercel + GitHub repository, in case of a private repository please add collaborator handle @lofcz. If at all possible, please do not submit a .zip file.
