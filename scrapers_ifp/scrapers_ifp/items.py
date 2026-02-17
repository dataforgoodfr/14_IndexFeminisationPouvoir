# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from scrapy import Item, Field
from itemloaders.processors import TakeFirst


class Identite(Item):
    identite = Field(output_processor=TakeFirst())
