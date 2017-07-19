/**
 * Holds all the models that are specific to this harvester.
 * These are generally things like mappings, which convert source data into the refinery message schema
 */

module.exports = {};

module.exports.harvesterMetadata = {
  "name": "JsonPlaceholder harvester",
  "desc": "Harvests from JSON Placeholder",
  "operations": [
    {
      "name": "Synchronize",
      "path": "/sync",
      "method": "POST",
      "desc": "Runs a full sync from the data source, generating all messages."
    }
  ]
}

module.exports.userTransform = (itm) => {
  return {
    "Name": itm.name,
    "NodeType":"User",
    "Priority": 1,
    "ConformedDimensions": {
      "Id": itm.id
    },
    "Properties": {
      "Username":itm.username,
      "Phone":itm.phone,
      "Website":itm.website,
      "Company":itm.company.name,
    },
  }
}

module.exports.postTransform = (itm) => {
  return {
    "Name": itm.title,
    "NodeType":"Post",
    "Priority": 1,
    "ConformedDimensions": {
      "Id": itm.id
    },
    "Properties": {
      "Body": itm.body
    },
    "Connections": [
      {
        "NodeType": "User",
        "RelType": "PostedByUser",
        "ForwardRel": true,
        "ConformedDimensions": {
          "Id": itm.userId
        }
      }
    ]
  }
}

module.exports.commentTransform = (itm) => {
  return {
    "Name": itm.name,
    "NodeType":"Comment",
    "Priority": 1,
    "ConformedDimensions": {
      "Id": itm.id
    },
    "Properties": {
      "Body": itm.body,
      "Email": itm.email
    },
    "Connections": [
      {
        "NodeType": "Post",
        "RelType": "CommentOnPost",
        "ForwardRel": true,
        "ConformedDimensions": {
          "Id": itm.postId
        }
      }
    ]
  }
}

module.exports.albumTransform = (itm) => {
  return {
    "Name": itm.title,
    "NodeType":"Album",
    "Priority": 1,
    "ConformedDimensions": {
      "Id": itm.id
    },
    "Connections": [
      {
        "NodeType": "User",
        "RelType": "AlbumByUser",
        "ForwardRel": true,
        "ConformedDimensions": {
          "Id": itm.userId
        }
      }
    ]
  }
}

module.exports.photoTransform = (itm) => {
  return {
    "Name": itm.title,
    "NodeType":"Photo",
    "Priority": 1,
    "ConformedDimensions": {
      "Id": itm.id
    },
    "Properties": {
      "Url": itm.url,
      "ThumbnailUrl": itm.thumbnailUrl
    },
    "Connections": [
      {
        "NodeType": "Album",
        "RelType": "PhotoInAlbum",
        "ForwardRel": true,
        "ConformedDimensions": {
          "Id": itm.albumId
        }
      }
    ]
  }
}

module.exports.todoTransform = (itm) => {
  return {
    "Name": itm.title,
    "NodeType": "Todo",
    "Priority": 1,
    "ConformedDimensions": {
      "Id": itm.id
    },
    "Properties": {
      "Completed": itm.completed,
    },
    "Connections": [
      {
        "NodeType": "User",
        "RelType": "TodoByUser",
        "ForwardRel": true,
        "ConformedDimensions": {
          "Id": itm.userId
        }
      }
    ]
  }
}