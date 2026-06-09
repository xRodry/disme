# OpenAPI\Client\EventTypeNamespacesApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**eventTypeNamespacesEventTypesList()**](EventTypeNamespacesApi.md#eventTypeNamespacesEventTypesList) | **GET** /event_type_namespaces/{name}/event_types/ | 
[**eventTypeNamespacesList()**](EventTypeNamespacesApi.md#eventTypeNamespacesList) | **GET** /event_type_namespaces/ | 
[**eventTypeNamespacesRead()**](EventTypeNamespacesApi.md#eventTypeNamespacesRead) | **GET** /event_type_namespaces/{name}/ | 


## `eventTypeNamespacesEventTypesList()`

```php
eventTypeNamespacesEventTypesList($name, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20023
```



Returns a list of all the available event types from a namespaces.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiEventTypeNamespacesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$name = 'name_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->eventTypeNamespacesEventTypesList($name, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling EventTypeNamespacesApi->eventTypeNamespacesEventTypesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20023**](../Model/InlineResponse20023.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `eventTypeNamespacesList()`

```php
eventTypeNamespacesList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20022
```



Returns a list of all the available event type namespaces.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiEventTypeNamespacesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->eventTypeNamespacesList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling EventTypeNamespacesApi->eventTypeNamespacesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20022**](../Model/InlineResponse20022.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `eventTypeNamespacesRead()`

```php
eventTypeNamespacesRead($name): \app\App\Edms\OpenAPI\Client\Models\EventTypeNamespace
```



Returns the details of an event type namespace.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiEventTypeNamespacesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$name = 'name_example'; // string

try {
    $result = $apiInstance->eventTypeNamespacesRead($name);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling EventTypeNamespacesApi->eventTypeNamespacesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\EventTypeNamespace**](../Model/EventTypeNamespace.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
