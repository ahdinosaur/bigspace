var resource = require('resource'),
    thing = resource.define('thing');

thing.schema.description = 'thing tracker thing'
// based on https://github.com/garyhodgson/thing-tracker-network/blob/master/specification/schema.js-schema

thing.property('version', {
  "type": "number",
  "default": 0.0
});

thing.property('url');
thing.property('description');
thing.property('updated');

thing.property('things-count', {
  "type": "number",
  "default": 1
});

thing.property('trackers-count', {
  "type": "number",
  "default": 1
});

thing.property('trackers-traversal-depth', {
  "type":"number"
});

thing.property('maintainers', {
  "description": "",
  "properties": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "required": true
        },
        "url": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        'x-identity-metadata': {
          "type": "object"
        } 
      }
    }
  }
});

thing.property('things', {
        "description": '',
        "properties": {
                "type": "array",
                "items": {
                        "type": "object",
                        "properties": {
                                "uuid": {
                                        "type": "string",
                                        "required": true
                                },
                                "title": {
                                        "type": "string",
                                        "required": true
                                },
                                "url": {
                                        "type": "string",
                                        "required": true
                                },
                                "authors": {
                                        "properties": {
                                                "type": "array",
                                                "items" : {
                                                        "type": "object",
                                                        "properties": {
                                                                "name": {
                                                                        "type": "string",
                                                                        "required": true
                                                                },
                                                                "url": {
                                                                        "type": "string"
                                                                },
                                                                "email": {
                                                                        "type": "string"
                                                                },
                                                                'x-identity-metadata': {
                                                "type": "object"
                                        } 
                                                        }
                                                }
                                        }
                                },
                                "licenses": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "string"
                                                }
                                        }
                                },
                                "tags": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "string"
                                                }
                                        }
                                },
                                'thumbnail-urls': {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "string"
                                                }
                                        }
                                },
                                "description": {
                                        "type": "string"
                                },
                                "created": {
                                        "type": "string"
                                },
                                "updated": {
                                        "type": "string"
                                },
                                "metadata": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "object",
                                                        "properties": {
                                                                "created": {
                                                                        "type": "string"
                                                                },
                                                                "updated": {
                                                                        "type": "string"
                                                                },
                                                                "submitter": {
                                                                        "properties": {
                                                                                "type": "array",
                                                                                "items": {
                                                                                        "type": "object",
                                                                                        "properties": {
                                                                                                "name": {
                                                                                                        "type": "string"
                                                                                                },
                                                                                                "url": {
                                                                                                        "type": "string"
                                                                                                },
                                                                                                "email": {
                                                                                                        "type": "string"
                                                                                                }
                                                                                        }
                                                                                }
                                                                        }
                                                                }
                                                        }
                                                }
                                        }
                                },
                                "subject": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "string"
                                                }
                                        }
                                },
                                "media": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "string"
                                                }
                                        }
                                },
                                "categories": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "string"
                                                }
                                        }
                                },
                                "tags": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "string"
                                                }
                                        }
                                },
                                "relationships": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "object",
                                                        "properties": {
                                                                "type": {
                                                                        "type": "string"
                                                                },
                                                                "url": {
                                                                        "type": "string"
                                                                },
                                                                "x-relationship-metadata": {
                                                                        "type": "object"
                                                                }
                                                        }
                                                }
                                        }
                                },
                                'bill-of-materials': {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "object",
                                                        "properties": {
                                                                "part-number": {
                                                                        "type": "string"
                                                                },
                                                                "description": {
                                                                        "type": "string"
                                                                },                                                              
                                                                "type": {
                                                                        "type": 'generated'
                                                                },
                                                                "url": {
                                                                        "type": "string"
                                                                },
                                                                "mime-type": {
                                                                        "type": "string"
                                                                },
                                                                "unit": {
                                                                        "type": "string"
                                                                },
                                                                "quantity": {
                                                                        "type": "number"
                                                                },
                                                                "thumbnail-url": {
                                                                        "type": "string"
                                                                },
                                                                "x-bom-metadata": {
                                                                        "type": "object"
                                                                }
                                                        }
                                                }
                                        }
                                },
                                "instructions": {
                                        "properties": {
                                                "type": "array",
                                                "items": {
                                                        "type": "object",
                                                        "properties": {
                                                                "step": {
                                                                        "type": "number"
                                                                },
                                                                "text": {
                                                                        "type": "string"
                                                                },
                                                                'image-urls': {
                                                                        "properties": {
                                                                                "type": "array",
                                                                                "items": {
                                                                                        "type": "string"
                                                                                }
                                                                        }
                                                                },
                                                                "x-instruction-metadata": {
                                                                        "type": "object"
                                                                }
                                                        }
                                                }
                                        }
                                },
                                "x-thing-metadata": {
                                        "type": "object"
                                }
                        }
                }
        }
});

thing.property('thing-cache', { 
        "description": '',
        "properties": {
                "url": {
                        "type": "string"
                },
                "things-count": {
                        "type": "number"
                },
                "updated": {
                        "type": "string"
                },
                "x-things-cache-metadata": {
                        "type": "object"
                }
        }
});

thing.property('x-tracker-metadata', {
        "description": "",
        "properties": {
                "type":"object"
        }
});

thing.property('trackers', {
        "description": "",
        "properties": {
                "type": "array",
                "items": {
                        "type": "object",
                        "properties": {
                                "uuid": {
                                        "type": "string"
                                },
                                "url": {
                                        "type": "string"
                                },
                                "accessed": {
                                        "type": "string"
                                },
                                "status": {
                                        "type": "string"
                                }
                        }
                }
        }
});

thing.property('things-cache', {
        "description": "",
        "properties": {
                "url": {
                        "type": "string",
                        "required": true
                },
                "things-count": {
                        "type": "number"
                },
                "updated": {
                        "type": "string"
                },
                "x-things-cache-metadata": {
                        "type": "object"
                }
        }
});

exports.thing = thing;
