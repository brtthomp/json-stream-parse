# 1.0.2

### BUGFIXES
* `algorithm1` would fail to parse messages that were split into multiple packets if one of those packets happened to end in a `}` or `]`.

# 1.0.1
* Changed `algorithm1` to use Buffer.indexOf instead of a manual loop.  This is due to the performance increase with indexOf as it is implemented in C++ rather than raw JS code