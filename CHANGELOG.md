# 1.0.1
* Changed `algorithm1` to use Buffer.indexOf instead of a manual loop.  This is due to the performance increase with indexOf as it is implemented in C++ rather than raw JS code