# Capital One Wave - A plugin for Wordpress
 
Quite a few people upset that [Wave went ahead and changed data aggregators, moving to Plaid](https://support.waveapps.com/hc/en-us/articles/360001114443-Possible-integration-issue-with-Capital-One), and therefore losing connectivity with Capital One (in 2022/2023).

I decided that I'd just create a workaround using Zapier and a Wordpress webhook endpoint, to at least move Capital One charges into Wave -- automagically.

This plugin should only be used anymore if you're on a free Wave plan and are not concerned about security (since this plugin does not use OAuth).

If this plugin is close to what you need but *not quite,* [reach out to discuss secure custom bookkeeping/etc API integrations with us](https://canyonwebworks.com)!

## Requirements
- A Wave Apps account
- A Capital One credit card account
- A [Zapier](https://zapier.com/) account (a free account should work)
- A Wordpress site with the [WP Webhooks plugin](https://wordpress.org/plugins/wp-webhooks/) installed
- This Cap One to Wave Wordpress plugin
- Perhaps a PHP developer, PHP skills, and/or strong determination and a few pots of coffee in order to arrange and customize the setup.

## Setup

### Step 1
Sign into [Zapier Parser](https://parser.zapier.com/login/) with your existing Zapier account (using the orange button) and create a mailbox. You will now have an email address that looks like *alphanumeric@robot.zapier.com*. The next screen will say "We're waiting..." Skip this by clicking "Skip Waiting." 

You can change your Zapier Format email address to something even more unique at this point, and I do recommend that. Keep note of what you change it to.

Every Capital One Instant Purchase Notification will be formatted similarly, and we are going to take advantage of that fact, since Zapier's email parser can extract data from emails when they come through with a consistent format. Pretty smart robot, eh?

Capital one alert emails will include text that looks like the following. If yours is different, you'll need to adjust the template based on the emails you get from Capital One. But for the most part, your email (and so your template) should look like this:

> **As requested, we're notifying you that on {{date}}, at {{payee}}, a pending
authorization or purchase in the amount of ${{amount}} was placed or charged on
your Capital One® credit card account.**

> **Note: You'll receive this notification for both purchases and pending
authorizations, such as car rentals, hotel reservations and gas purchases,
even if an actual transaction hasn't taken place.**

Cut and paste that to the "Inital Template" field. Leave the other Body Source and Parser Engine settings as they are, and click the blue "Save Address and Template" button. We've done a couple things here, but most importantly we've told the robot to look for a payment date {{date}}, a payee {{payee}} and an {{amount}}, which we will need to set up our Wave transaction later.

### Step 2
Sign into myaccounts.capitalone.com and go to top right of screen pulldown, click "Profile," then scroll down to Personal Email & Business Email sections. Enter your new wacky Zapier robot email as one of your email addresses. Make sure to NOT set it as your primary email. Click save.

2a) Set up a Capital purchase alert: top right screen pulldown -> click "Alerts." Choose to create an "Instant Purchase Notification" for any purchase over $1 (that's their minimum. You'll miss some tiny charges, but heck, you can't win 'em all. The email address to use? That's right, your new wacky Zapier robot email address. Use that one.

This means now that whenever there is a charge over $1 on your Capital One account, an email will be sent to a smart Zapier inbox, with just what we need: a date, a payee, and an amount. The Zapier parser will pull out those details for us.

### Step 3
Time to set up a new Zap. The Zap trigger will be "Email Parser by Zapier." The trigger event will be "New Email." Next step is to choose the account. Select your Zapier Parser account where you just created a mailbox. Next, to set up a trigger, just choose the robot mailbox you just set up.

OK, now, big detour:

### Step 4
Make sure that WP Webhooks is installed on your Wordpress site. It doesn't even have to be *your* Wordpress site. Technically, you could even borrow one for this, but... don't. Install the plugin and go to the WP Webhooks settings page (*yourWPsite.com/wp-admin/options-general.php?page=wp-webhooks-pro&wpwhprovrs=settings*). Scroll down to the "Activate 'Receive Data' Actions" header and activate the "custom_action" action. Click Save All.

4a) Now go to the WP Webhooks "Receive Data" settings page (*yourWPsite.com/wp-admin/options-general.php?page=wp-webhooks-pro&wpwhprovrs=receive-data*). There's an orange button that says "Add Webhook." To the left of this button, make a unique name for your webhook, and then click the orange button. Now you've started something! Your webhook should now be in the list of available webhooks, after the default webhook created for you by the plugin. You could use this one, but I prefer to give things names which will make sense to me later, which is why I recommended you create your own webhook. See a webhook URL for your webhook? Great, you'll need that.

4b) There is another way to do this by creating Wordpress posts (using the WP Webhooks "create_post" action) for each email alert, and that could be good if you're really serious about accounting, or want to be able to re-try when posts don't go through, but let's keep this simple. We'll use the 'wpwhpro/run/actions/custom_action/return_args' filter hook from WP Webhooks to listen for when the webhook runs, and post to the Wave API.

### Step 5

Install the Cap One to Wave plugin (this code) for your Wordpress site. Once the plugin has been set up with a [Wave Apps token](https://developer.waveapps.com/hc/en-us/articles/360020948171-Create-a-Wave-Account-and-Test-Businesses) and business ID, it will green light you by providing drop down lists of liability accounts (for your Anchor in the transaction) and expense accounts for balancing the transaction. The selections you make will show up in your Wave Transactions; categorize carefully.

### Step 6
Back to the Zap. Add a second action - the "Webhooks by Zapier" type. The action event is "POST." The URL is your webhook URL from step 4a. Payload type is JSON. Complete the rest of the settings to look like this:

![Webhook settings](https://little-package.com/wp-content/uploads/2021/02/zapier-wave-capital-one-webhook-settings.png)

A simple Zap with only two actions: easy and done! It should be ready now, and a test of the Zap should send a transaction to Wave.

* How to be tricky when setting up a Zapier Email Parser mailbox: forward it a previously-acquired "Instand Purchase Notification" email from Capital One when Zapier says "I'm waiting..."
