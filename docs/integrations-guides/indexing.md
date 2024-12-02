# Blob Indexing

The EigenLabs hosted disperser supports a simple API which serves an index of the recently dispersed batches and blobs, as well as various operator statistics. This API powers the [EigenDA Blob Explorer](https://blobs.eigenda.xyz/). This data API is documented [here](https://dataapi.eigenda.xyz/api/v1/swagger/index.html#/).

For example, to list out recently dispersed blobs in production, use the following curl command:

```bash
$ curl -Ss -X 'GET' 'https://dataapi-holesky.eigenda.xyz/api/v1/feed/blobs' -H 'accept: application/json'

{
  "meta": {
    "size": 10
  },
  "data": [
    {
      "blob_key": "1fbd98e2cc644d0dcbafb95d676631adb63a12183d4b38475450c23322ef497a-313732393732303639393134303635353335332f302f33332f312f33332fe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "batch_header_hash": "3f652d862ff643c27b837b4e23b0a21bab05784b0c4490d38dc65aa3334464e8",
      "blob_index": 0,
...continued...
```

The data API endpoints are also documented on the individual [network pages](../networks/README.md).
