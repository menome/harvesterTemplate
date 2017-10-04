/**
 * Holds all the models that are specific to this harvester.
 * These are generally things like mappings, which convert source data into the refinery message schema
 */

/**
 * Holds all the models that are specific to this harvester.
 * These are generally things like mappings, which convert source data into the refinery message schema
 */

var config = require('./config.js');

module.exports = {};

//////////////////////////////////////
// These are transforms for REST responses.
//////////////////////////////////////
var baseUrl = config.get('url');
module.exports.queryTransforms = [
  {
    desc: "Pulling Posts",
    url: baseUrl + '/posts',
    transform: (itm) => {
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
  },
  {
    desc: "Pulling Users",
    url: baseUrl + '/users',
    transform: (itm) => {
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
  },
  {
    desc: "Pulling Comments",
    url: baseUrl + '/comments',
    transform: (itm) => {
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
  },
  {
    desc: "Pulling Albums",
    url: baseUrl + '/albums',
    transform: (itm) => {
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
  },
  {
    desc: "Pulling Photos",
    url: baseUrl + '/photos',
    transform: (itm) => {
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
  },
  {
    desc: "Pulling Todos",
    url: baseUrl + '/todos',
    transform: (itm) => {
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
  }, 
]

//////////////////////////////////////
// These are transforms for SQL tables
//////////////////////////////////////

module.exports.sqlTransforms = [
  {
    desc: "Pulling Cities",
    query: "SELECT * FROM city",
    transform: (itm) => {
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
  },
  {
    desc: "Pulling Countries",
    query: "SELECT * FROM country",
    transform: (itm) => {
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
  },
  {
    desc: "Pulling Languages",
    query: "SELECT * FROM language",
    transform: (itm) => {
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
  }
]