# OpenAPI\Client\IndexInstancesApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**indexInstancesList()**](IndexInstancesApi.md#indexInstancesList) | **GET** /index_instances/ | 
[**indexInstancesNodesDocumentsList()**](IndexInstancesApi.md#indexInstancesNodesDocumentsList) | **GET** /index_instances/{index_instance_id}/nodes/{index_instance_node_id}/documents/ | 
[**indexInstancesNodesList()**](IndexInstancesApi.md#indexInstancesNodesList) | **GET** /index_instances/{index_instance_id}/nodes/ | 
[**indexInstancesNodesRead()**](IndexInstancesApi.md#indexInstancesNodesRead) | **GET** /index_instances/{index_instance_id}/nodes/{index_instance_node_id}/ | 
[**indexInstancesRead()**](IndexInstancesApi.md#indexInstancesRead) | **GET** /index_instances/{index_instance_id}/ | 


## `indexInstancesList()`

```php
indexInstancesList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20026
```



Returns a list of all the indexes instances.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexInstancesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->indexInstancesList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexInstancesApi->indexInstancesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20026**](../Model/InlineResponse20026.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexInstancesNodesDocumentsList()`

```php
indexInstancesNodesDocumentsList($index_instance_id, $index_instance_node_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2006
```



Returns a list of all the documents contained by a particular index node instance.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexInstancesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_instance_id = 'index_instance_id_example'; // string
$index_instance_node_id = 'index_instance_node_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->indexInstancesNodesDocumentsList($index_instance_id, $index_instance_node_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexInstancesApi->indexInstancesNodesDocumentsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_instance_id** | **string**|  |
 **index_instance_node_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse2006**](../Model/InlineResponse2006.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexInstancesNodesList()`

```php
indexInstancesNodesList($index_instance_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2009
```



Returns a list of all the template nodes for the selected index.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexInstancesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_instance_id = 'index_instance_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->indexInstancesNodesList($index_instance_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexInstancesApi->indexInstancesNodesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_instance_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse2009**](../Model/InlineResponse2009.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexInstancesNodesRead()`

```php
indexInstancesNodesRead($index_instance_id, $index_instance_node_id): \app\App\Edms\OpenAPI\Client\Models\IndexInstanceNode
```



Returns the details of the selected index template node.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexInstancesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_instance_id = 'index_instance_id_example'; // string
$index_instance_node_id = 'index_instance_node_id_example'; // string

try {
    $result = $apiInstance->indexInstancesNodesRead($index_instance_id, $index_instance_node_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexInstancesApi->indexInstancesNodesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_instance_id** | **string**|  |
 **index_instance_node_id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexInstanceNode**](../Model/IndexInstanceNode.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexInstancesRead()`

```php
indexInstancesRead($index_instance_id): \app\App\Edms\OpenAPI\Client\Models\IndexInstance
```



Returns the details of the selected index instance.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexInstancesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_instance_id = 'index_instance_id_example'; // string

try {
    $result = $apiInstance->indexInstancesRead($index_instance_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexInstancesApi->indexInstancesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_instance_id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexInstance**](../Model/IndexInstance.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
