import asyncio
from aiohttp import web
import jinja2
import aiohttp_jinja2
import json
import argparse
import logging
import sys
import string
import random
from datetime import datetime

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler(stream=sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

averages = []
ratings = {}

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def jsonify(data):
    return web.Response(content_type="application/json", text=json.dumps(data))

@asyncio.coroutine
def display(request):
    return jsonify({
        'averages': averages,
        'ratings': ratings
        })

@asyncio.coroutine
def rate(request):
    data = yield from request.json()
    logger.info("received rate %s", data['num'])
    try:
        ratings[request.cookies['rateapp']] = data['num']
    except AttributeError:
        pass
    return jsonify({'ok': True})

@asyncio.coroutine
def home(request):
    context = {}
    response = aiohttp_jinja2.render_template('home.html', request, context)

    if 'rateapp' not in request.cookies:
        new_id = id_generator()
        logger.info("new client connecting, id=%s", new_id)
        response.set_cookie('rateapp', new_id)

    return response

@asyncio.coroutine
def init(loop, port):
    app = web.Application(loop=loop)
    app.router.add_route('GET', '/', home)
    app.router.add_route('GET', '/display.json', display)
    app.router.add_route('POST', '/rate.json', rate)
    app.router.add_static('/static', 'static')

    aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('templates'))

    srv = yield from loop.create_server(app.make_handler(), '0.0.0.0', port)
    print("Server started at http://0.0.0.0:%s" % port)
    return srv

def averager():
    global averages
    while True:
        nums = ratings.values()
        avg = float(sum(nums))/len(nums) if len(nums) > 0 else 0.0
        now = datetime.now().strftime("%c")
        logger.info("running averager. now=%s avg=%s", now, avg)
        averages.append([now, avg])
        if len(averages) > 100:
            averages = averages[1:]
        # every 10 seconds
        yield from asyncio.sleep(5)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run the machinery')
    parser.add_argument('-p', '--port', type=int, help='Port number', required=True)

    args = parser.parse_args()
    loop = asyncio.get_event_loop()
    asyncio.async(averager())
    loop.run_until_complete(init(loop, args.port))
    loop.run_forever()

