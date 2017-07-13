# TheLink - HarvesterTemplate

This serves as a boilerplate and an example for the data harvester pattern.

### Example Message Format
```
{
  "Name":"Konrad Aust",
  "NodeType":"Employee",
  "Priority": 1,
  "ConformedDimensions": {
    "Email": "konrad.aust@menome.com",
    "EmployeeId": 12345
  },
  "Properties": {
    "Status":"active"
  },
  "Connections": [
    {
      "Name": "Menome Victoria",
      "NodeType": "Office",
      "RelType": "LocatedInOffice",
      "ForwardRel": true,
      "ConformedDimensions": {
        "City": "Victoria"
      }
    },
    {
      "Name": "theLink",
      "NodeType": "Project",
      "RelType": "WorkedOnProject",
      "ForwardRel": true,
      "ConformedDimensions": {
        "Code": "5"
      }
    }
  ]
}
```

### Configuration

Configuration can be specified either through environment variables, or through a JSON config file, located at config/conf.json.

Environment variables will always overwrite JSON configs. If neither are found, defaults will be loaded.

#### Environment Variables:
```
RABBIT_URL=the URL of the RMQ server. eg. 'amqp://rabbitmq:rabbitmq@rabbit:5672?heartbeat=3600'
```

#### Example JSON Configuration:
```
{
  "rabbit": {
    "url": "amqp://rabbitmq:rabbitmq@rabbit:5672?heartbeat=3600",
    "routingKey": "syncevents.harvester.updates",
    "exchange": "syncevents"
  }
}
```