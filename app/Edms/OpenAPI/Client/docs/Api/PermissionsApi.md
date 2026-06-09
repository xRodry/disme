# OpenAPI\Client\PermissionsApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**permissionsList()**](PermissionsApi.md#permissionsList) | **GET** /permissions/ | 


## `permissionsList()`

```php
permissionsList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20033
```



Returns a list of all the available permissions.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiPermissionsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->permissionsList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling PermissionsApi->permissionsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20033**](../Model/InlineResponse20033.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
