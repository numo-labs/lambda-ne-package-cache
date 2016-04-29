# lambda-ne-package-cache
cache ne classic packages for 5mins to return results to clients much faster.

[![Codeship Status](https://www.codeship.io/projects/ea128e30-f013-0133-d4d1-7aa0b68b0e4b?branch=master)](https://codeship.com/projects/149152)
[![codecov](https://codecov.io/gh/numo-labs/lambda-ne-package-cache/branch/master/graph/badge.svg)](https://codecov.io/gh/numo-labs/lambda-ne-package-cache)


## *Why?*

Fetching Travel Packages (*to show potential travelers in search results*)
from the API takes ***3 seconds*** *minimum* ... (*we've seen it take up to 8 seconds...*!)

![api-request-time](https://cloud.githubusercontent.com/assets/194400/14903775/6d991418-0d9b-11e6-9910-8e58095bea8b.png)


## *What?*




## *How?*




### Environment variables

To run this project on your local machine (*or on AWS*) you will need to
have a few Environment variables exported.

Create a file in the root of the project called `.env` and paste the following
sample into it;

```sh
export NE_API_KEY=ASKTheTeamForAKey
export NE_API_URL=https://api.travel.net
export AWS_REGION=eu-west-1
export AWS_IAM_ROLE=arn:aws:iam::123456789:role/lambdafull
export AWS_ACCESS_KEY_ID=YOUR_ID
export AWS_SECRET_ACCESS_KEY=YORKIE
```
Then add the *real* values.

> Environment Variables on a Lambda...?

Because we are using [`env2`](https://github.com/dwyl/env2) we can
load our environment variables from a *file* ...
that file is an `.env` file (*by naming convention*) which gets ignored
in the `.gitignore` which means it's never published to GitHub.

## Open Source the "*Secret Sauce*"...?

As stated above, in order to run this project you will need to have
all the environment variables. To get those you need to contact the TC Nordics API Team.
So while the `code` is 100% open, the `keys` are not.

Think of it this way: If I give you the *location* of the bank vault,
but don't tell you the secret combination, did I just give you all my money?
No, I didn't. You are no closer to swimming in my `cache`.
