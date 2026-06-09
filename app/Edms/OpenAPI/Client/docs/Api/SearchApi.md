# OpenAPI\Client\SearchApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**searchAdvancedRead()**](SearchApi.md#searchAdvancedRead) | **GET** /search/advanced/{search_model}/ | 
[**searchRead()**](SearchApi.md#searchRead) | **GET** /search/{search_model}/ | 


## `searchAdvancedRead()`

```php
searchAdvancedRead($search_model, $page)
```



Perform an advanced search operation

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\App\Edms\OpenAPI\Client\ApiSearchApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$search_model = 'search_model_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $apiInstance->searchAdvancedRead($search_model, $page);
} catch (Exception $e) {
    echo 'Exception when calling SearchApi->searchAdvancedRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search_model** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

void (empty response body)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `searchRead()`

```php
searchRead($search_model, $page)
```



Perform a search operation

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiSearchApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$search_model = 'search_model_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $apiInstance->searchRead($search_model, $page);
} catch (Exception $e) {
    echo 'Exception when calling SearchApi->searchRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search_model** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

void (empty response body)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
