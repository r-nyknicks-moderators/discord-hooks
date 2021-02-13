# Discord-hooks

- [x] Add new report to DB
  - Fire Discord Hook
- [ ] Update existing Report
- [ ] Track individual User metrics

Future:

- [x] Can respond to bot to remove post
- [ ] Keep track of the username that is reported
- [ ] Send daily notice of users reported
- [x] Check for bad comments
- [ ] Trade posts will alert us. Eventually can check the quality of the trade
- [x] Article posted from non whitelisted sites
- [ ] Check comment stream for the word mods. Maybe suggest sub to use a keyword to ping us
- [ ] Make sure Athletic articles don't get copied and pasted
- [ ] Keep track of quality posts, and try to reward those

## Spin Up Steps

### Clone the Repository to your machine

Copy the `.env.example` file and title it `.env`
You'll get the necessary credentials during setup

Once you've done that, we will want to make sure the machine has all of the required dependencies to start the app.

## Install global dependencies

I'm working on a Mac so these steps are assuming you have one too

You should have git installed, if you don't, [install it](https://www.atlassian.com/git/tutorials/install-git)

[Install Node.js](https://changelog.com/posts/install-node-js-with-homebrew-on-os-x)

- I have 15.0.1 but you should be able to use anything above 12 without issues.
- There is a world where we will need 15.0.1 and npm v7 to integrate with workspaces, but we're not there yet
- Heroku uses 12.9 which is where our app will live for now

If you have not created a Heroku account, please do so.
Once you have an account, send ClydeEdgar a DM on Discord with your email address you used so I can add you as a memeber of the project

[Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
Follow the steps to log in from your terminal

On Reddit, you should have been added to the application as a developer. [Check Here](https://www.reddit.com/prefs/apps) and gather the client ID and secret. Add them in the appropriate place in the .env file
<img src="https://justinstolpe.com/blog/wp-content/uploads/2019/01/testappedited.png" height=250 width=600 />

---

Use this [tool to get your refresh token](https://github.com/not-an-aardvark/reddit-oauth-helper) for the application to connect the application to your Reddit Account (allow all scopes). Use permanent token as temporary needs a refresh every hour.

**Selections**

- web app
- Copy Client ID from location above
- Copy Client Secret from location above
- Select all scopes (space and then up arrow until you have all green)

Copy the json output (in the browser or in the terminal) and update the `.env` file accordingly
You can always get another set of this information by re-authorizing the application

At this point, you should be able to run `npm install` in the repo
Once that is complete, try to spin up the app using `npm run dev`

If it doesn't work, provide error message output in Discord so we can debug.

## Workflow

Take a look at the [board on Github](https://github.com/r-nyknicks-moderators/discord-hooks/projects/1). Grab a ticket and start going.

ClydeEdgar will handle the infrastructure stuff so please leave those ones for now. He will handle any potential financial things that may arise from hosting/db stuff

Create a feature branch - username/description [eggdev/capturing-reports]

Do your work locally. Commit your code often. Use the [conventional commit format](conventionalcommits.org). I haven't done it to start the repo but will be doing so going forward. It's good practice in general

When you're ready to submit a PR, open one on Github, request review from the team.

Once the work is approved it you can squash and merge into master and it will trigger a deploy
