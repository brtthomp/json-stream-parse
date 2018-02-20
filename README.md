# json-stream-parse

Emits JSON objects/arrays from a Buffer stream.

```
const Parser = require("json-stream-parse"),
    net = require("net");

const parser = new Parser(),
    socket = new net.Socket();

parser.on("json", (json) => {
    console.log(json);
});

socket.connect(8888, '127.0.0.1', () => {
    socket.pipe(parser);
})
```

## Events
`json-stream-parser` is a Writeable stream that emits only one event, `json`.  This event is emitted any time a valid JSON object or array is found within the stream.  Any data that is found to be invalid JSON is ignored.

## License
MIT