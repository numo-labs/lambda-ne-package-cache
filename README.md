# lambda ne package cache
cache ne classic packages for `{X}` mins to return results to clients *super* faster.

[![Codeship Build Status](https://img.shields.io/codeship/ea128e30-f013-0133-d4d1-7aa0b68b0e4b.svg?maxAge=2592000)](https://codeship.com/projects/149152)
[![Codecov Test Coverage](https://img.shields.io/codecov/c/github/numo-labs/lambda-ne-package-cache/master.svg?maxAge=2592000)](https://codecov.io/gh/numo-labs/lambda-ne-package-cache)

![numo-sample-packages](https://cloud.githubusercontent.com/assets/194400/14930111/5d0f3488-0e59-11e6-8ae4-321498f0cfa0.png)

## *Why?*

Fetching Travel Packages (*to show potential travelers in search results*)
from the API takes ***3 seconds*** *minimum* ... (*we've seen it take up to 8 seconds...*!)

![api-request-time](https://cloud.githubusercontent.com/assets/194400/14903775/6d991418-0d9b-11e6-9910-8e58095bea8b.png)

The packages don't change, what does change is the ***Prices and Availability***,
but even this does not change more than every hour
(*unless a package is totally sold out, which is rare!*).
So ... if we cache the listings for an hour the probability that a given package
will be unavailable once the person clicks through to booking is low.
(*we should track this and determine if its a risk to cache...*)


## *What?*

This ***experimental*** lambda caches *one* package for each hotel/resort
so when people search for a given destination, we can ***immediately*** return
a *sample* result to the client (*sub 200ms*).

> Our *existing* **NE Package Provider** Lambda function uses API Gateway
as a *Reverse-Proxy* which caches the API requests, this is *good* but
its *much slower* than caching the sample packages in the Lambda Container's RAM.


## *How?*

Search queries from the frontend application (UI/Client) first go to
CloudSearch where we look for the *place* (*against our list of Geonames tags*)
once we have the list of places (*geonames ids*) we send them to Neo4J
and look for the ***Master Hotles*** corresponding to the places s


### 1. List NE Hotels mapped to Master Hotel ID (MHID)

At present only **2212** NE Hotels are mapped to Master Hotels
(*the mapping is an on-going project we do not have control/influence over*...)

> See: https://github.com/numo-labs/taggable-master-hotel-mapping-script (*private repo*)

The NE Metadata API only requests for trips with hotelIds in batches of 30.  
so *initially* I split the list of NE hotelIds into (2212/30=**74**) **74 batches**.

> If we split the list of `hotelIds` into batches of 30 we only get packages
for 349 of the hotels.  
> see: `lib/get_packages.js` for the experiment script.  
> But when we reduce the batch size the number of results go *up*:

| Batch size | Requests/Batches | Time (ms) | Packages |
| -----------|:----------------:|:---------:|:--------:|
| 30 | 74  | 34804  | 349 |
| 25 | 89  | 99924  | 416 |
| 20 | 111 | 113483 | 522 |
| 15 | 148 | 150543 | 591 |
| 10 | 221 | 116966 | 710 |
| 5  | 442 | 445671 | 852 |
| 1  | 2210 | 2211731 | 964 |

> Ultimately we are going to have to send ***one request*** to the API for
***each hotel*** to ensure that we are getting the results.

Still the *vast* majority of Hotels do not have packages available ...

we need to execute the entire set of API requests in 290 seconds (*Lambda is Max 300 sec*)  
therefore we need to run (2210/290=) **8 requests per second** (*one every 125ms*).


### *Required* Environment variables

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
Then add the *real* values for each of the keys.

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
