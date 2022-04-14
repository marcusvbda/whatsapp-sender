## Deployment
We will deploy the bot to Heroku here, but you may choose any host that provides support for Node apps.

1. [Install](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) Heroku CLI following instructions for your system. Make sure to do `heroku login` to connect your account.

2. Change directory to your project folder on local. (It is assumed you have already cloned the repository)

3. Create the heroku app.
    ```bash
    heroku create <app-name>
    ```
    Leave `<app-name>` blank to let Heroku choose a random name.

4. Go to [Personal apps | Heroku](https://dashboard.heroku.com/apps/) &#8594; `<app-name>` &#8594; Settings.
    Scroll down to Buildpacks and add the following buildpacks:

    a. Puppeteer for Heroku
    ```
    https://github.com/jontewks/puppeteer-heroku-buildpack
    ```

    b. Google Chrome for Heroku
    ```
    https://github.com/heroku/heroku-buildpack-google-chrome
    ```

    ![Buildpacks](https://i.imgur.com/SWMVgR8.png)

5. Push your local repository to heroku application.
    ```bash
    git push heroku master
    ```
