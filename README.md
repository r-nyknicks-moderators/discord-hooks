# Discord-hooks

- [ ] Discord Hooks that fire when things are reported
- [ ] Can respond to bot to remove post
- [ ] Keep track of the username that is reported
- [ ] Send daily notice of users reported
- [ ] Check for bad comments
- [ ] Trade posts will alert us. Eventually can check the quality of the trade
- [ ] Article posted from non whitelisted sites
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
- Heroku uses 12.9 which is where our app will live for now

If you have not created a Heroku account, please do so.
Once you have an account, send ClydeEdgar a DM on Discord with your email address you used so I can add you as a memeber of the project

[Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) - Don't use the command `heroku push origin master`. We're going to have restrictions on deploying soon. It'll only deploy from merges into the master branch.

You should have been added to the application as a developer. [Check Here](https://www.reddit.com/prefs/apps) and gather the client ID and secret. Add them in the appropriate place in the .env file
<img src="https://justinstolpe.com/blog/wp-content/uploads/2019/01/testappedited.png" height=250 width=600 />

---

Use this [tool to get your refresh token](https://github.com/not-an-aardvark/reddit-oauth-helper) for the application
Use the credentials given over discord to connect the application to your Reddit Account (allow all scopes)
Copy the output (in the browser or in the terminal)
You can always get another set of this information by re-authorizing the application

At this point, you should be able to run `npm install` in the repo
Once that is complete, try to spin up the app using `npm run dev`

If it doesn't work, provide error message output in Discord so we can debug.

## Workflow

Create a feature branch - username/description [eggdev/capturing-reports]

Do your work. Commit early and often.

When you're ready to submit a PR, open one on Github, request review from the team.
Once the work is approved it you can merge into master and it will trigger a deploy
