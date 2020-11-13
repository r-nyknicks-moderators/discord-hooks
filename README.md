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

Copy the example.secrets.json file and title it `secrets.json`
Change all of the strings based on the credentials recieved over Discord.

Once you've done that, we will want to make sure the machine has all of the required dependencies to start the app.

### Install global dependencies

You should have git installed, if you don't, [install it](https://www.atlassian.com/git/tutorials/install-git)

Install Node.js - I have 15.0.1 but you should be able to use anything above 12 without issues. Heroku uses 12.9 which is where our app will live.

Use this [tool to get your refresh token](https://github.com/not-an-aardvark/reddit-oauth-helper) for the application
Use the credentials given over discord to connect the application to your Reddit Account (allow all scopes)
Copy the output (in the browser or in the terminal)
You can always get another set of this information by re-authorizing the application
