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
    },
    {
      "name": "SQL Synchronize",
      "path": "/sqlsync",
      "method": "POST",
      "desc": "Runs a full sync from the SQL data source, generating all messages."
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

//////////////////////////////////////
// These are transforms for SQL tables
//////////////////////////////////////

module.exports.cityTransform = (itm) => {
  return {
    "Name": itm.Name,
    "NodeType":"City",
    "Priority": 1,
    "ConformedDimensions": {
      "Id": itm.ID
    },
    "Properties": {
      "District":itm.District,
      "Population":itm.Population
    },
    "Connections": [
      {
        "NodeType": "Country",
        "RelType": "CityInCountry",
        "ForwardRel": true,
        "ConformedDimensions": {
          "Code": itm.CountryCode
        }
      }
    ]
  }
}

module.exports.countryTransform = (itm) => {
  var msg = {
    "Name": itm.Name,
    "NodeType":"Country",
    "Priority": 1,
    "ConformedDimensions": {
      "Code": itm.Code
    },
    "Properties": {
      "Continent":itm.Continent,
      "Region":itm.Region,
      "SurfaceArea": itm.SurfaceArea,
      "IndepYear": itm.IndepYear,
      "Population": itm.Population,
      "LifeExpectancy": itm.LifeExpectancy,
      "GNP": itm.GNP,
      "LocalName": itm.LocalName,
      "GovernmentForm": itm.GovernmentForm,
      "HeadOfState": itm.HeadOfState,
      "Code2": itm.Code2
    },
    "Connections": []
  }

  if(itm.Capital) {
    msg.Connections.push({
      "NodeType": "City",
      "RelType": "IsCapitalOf",
      "ForwardRel": false,
      "ConformedDimensions": {
        "ID": itm.Capital
      }
    })
  }

  return msg
}

module.exports.countryLanguageTransform = (itm) => {
  return {
    "Name": itm.Language,
    "NodeType":"Language",
    "Priority": 1,
    "ConformedDimensions": {
      "Id": itm.Language
    },
    "Properties": {
      "IsOfficial":itm.IsOfficial,
      "Percentage":itm.Percentage
    },
    "Connections": [
      {
        "NodeType": "Country",
        "RelType": "LanguageSpokenByCountry",
        "ForwardRel": true,
        "ConformedDimensions": {
          "Code": itm.CountryCode
        }
      }
    ]
  }
}