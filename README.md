## gfwlist2clash-cloudflare-worker
A worker that intended to insert gfwlist to your clash config rules.

## Usage
Deploy with cloudflare deploy tool online:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Misaka-0x447f/gfwlist2clash-cloudflare-worker)

Or deploy at your local machine:

```sh
git clone git@github.com:Misaka-0x447f/gfwlist2clash-cloudflare-worker.git
wrangler deploy
```

## Example
Pretend your config file seems like this (deployed at https://example.com/clash.yaml)

```yaml
mixed-port: 7890
mode: rule
# ......
proxy-groups:
  - name: bridge  # this could be your groupName.
    type: select
    use:
      - provider
proxy-providers:
  provider:
    type: http
    url: https://example.com/proxy.txt
    interval: 3600
    # ......
rules:
  - DOMAIN-SUFFIX,example.com,PROXY
  # ......
  - ruleSlot  # this is where you want to insert rules
  - GEOIP,CN,DIRECT
```

Then you can use this url to subscribe your config along with gfwlist:

https://gfwlist2clash.workers.dev/?base=https%3A%2F%2Fexample.com%2Fclash.yaml&groupName=bridge

(This server does not exist. Please deploy cloudflare worker your self.)

## Get Parameters

'base' is the only required get parameter.

```
base      *[encodedUrl] base config file you want to merge in. it must contain an item in "rules" called "ruleSlot".
src        [encodedUrl] gfwlist source. default: github
groupName  [string]     specify destination proxy group name. default: PROXY
```
