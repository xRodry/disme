# OpenAPI\Client\IndexTemplatesApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**indexTemplatesCreate()**](IndexTemplatesApi.md#indexTemplatesCreate) | **POST** /index_templates/ | 
[**indexTemplatesDelete()**](IndexTemplatesApi.md#indexTemplatesDelete) | **DELETE** /index_templates/{index_template_id}/ | 
[**indexTemplatesList()**](IndexTemplatesApi.md#indexTemplatesList) | **GET** /index_templates/ | 
[**indexTemplatesNodesCreate()**](IndexTemplatesApi.md#indexTemplatesNodesCreate) | **POST** /index_templates/{index_template_id}/nodes/ | 
[**indexTemplatesNodesDelete()**](IndexTemplatesApi.md#indexTemplatesNodesDelete) | **DELETE** /index_templates/{index_template_id}/nodes/{index_template_node_id}/ | 
[**indexTemplatesNodesList()**](IndexTemplatesApi.md#indexTemplatesNodesList) | **GET** /index_templates/{index_template_id}/nodes/ | 
[**indexTemplatesNodesPartialUpdate()**](IndexTemplatesApi.md#indexTemplatesNodesPartialUpdate) | **PATCH** /index_templates/{index_template_id}/nodes/{index_template_node_id}/ | 
[**indexTemplatesNodesRead()**](IndexTemplatesApi.md#indexTemplatesNodesRead) | **GET** /index_templates/{index_template_id}/nodes/{index_template_node_id}/ | 
[**indexTemplatesNodesUpdate()**](IndexTemplatesApi.md#indexTemplatesNodesUpdate) | **PUT** /index_templates/{index_template_id}/nodes/{index_template_node_id}/ | 
[**indexTemplatesPartialUpdate()**](IndexTemplatesApi.md#indexTemplatesPartialUpdate) | **PATCH** /index_templates/{index_template_id}/ | 
[**indexTemplatesRead()**](IndexTemplatesApi.md#indexTemplatesRead) | **GET** /index_templates/{index_template_id}/ | 
[**indexTemplatesUpdate()**](IndexTemplatesApi.md#indexTemplatesUpdate) | **PUT** /index_templates/{index_template_id}/ | 


## `indexTemplatesCreate()`

```php
indexTemplatesCreate($data): \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite
```



Create a new index template.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite(); // \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite

try {
    $result = $apiInstance->indexTemplatesCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite**](../Model/IndexTemplateWrite.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite**](../Model/IndexTemplateWrite.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesDelete()`

```php
indexTemplatesDelete($index_template_id)
```



Delete the selected index template.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string

try {
    $apiInstance->indexTemplatesDelete($index_template_id);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |

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

## `indexTemplatesList()`

```php
indexTemplatesList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20027
```



Returns a list of all the defined indexes template.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->indexTemplatesList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20027**](../Model/InlineResponse20027.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesNodesCreate()`

```php
indexTemplatesNodesCreate($index_template_id, $data): \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite
```



Create a new index template node.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite(); // \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite

try {
    $result = $apiInstance->indexTemplatesNodesCreate($index_template_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesNodesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite**](../Model/IndexTemplateNodeWrite.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite**](../Model/IndexTemplateNodeWrite.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesNodesDelete()`

```php
indexTemplatesNodesDelete($index_template_id, $index_template_node_id)
```



Delete the selected index template node.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string
$index_template_node_id = 'index_template_node_id_example'; // string

try {
    $apiInstance->indexTemplatesNodesDelete($index_template_id, $index_template_node_id);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesNodesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |
 **index_template_node_id** | **string**|  |

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

## `indexTemplatesNodesList()`

```php
indexTemplatesNodesList($index_template_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20028
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


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->indexTemplatesNodesList($index_template_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesNodesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20028**](../Model/InlineResponse20028.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesNodesPartialUpdate()`

```php
indexTemplatesNodesPartialUpdate($index_template_id, $index_template_node_id, $data): \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite
```



Partially edit an index template node.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string
$index_template_node_id = 'index_template_node_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite(); // \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite

try {
    $result = $apiInstance->indexTemplatesNodesPartialUpdate($index_template_id, $index_template_node_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesNodesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |
 **index_template_node_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite**](../Model/IndexTemplateNodeWrite.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite**](../Model/IndexTemplateNodeWrite.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesNodesRead()`

```php
indexTemplatesNodesRead($index_template_id, $index_template_node_id): \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNode
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


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string
$index_template_node_id = 'index_template_node_id_example'; // string

try {
    $result = $apiInstance->indexTemplatesNodesRead($index_template_id, $index_template_node_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesNodesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |
 **index_template_node_id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateNode**](../Model/IndexTemplateNode.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesNodesUpdate()`

```php
indexTemplatesNodesUpdate($index_template_id, $index_template_node_id, $data): \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite
```



Edit an index template node.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string
$index_template_node_id = 'index_template_node_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite(); // \app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite

try {
    $result = $apiInstance->indexTemplatesNodesUpdate($index_template_id, $index_template_node_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesNodesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |
 **index_template_node_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite**](../Model/IndexTemplateNodeWrite.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateNodeWrite**](../Model/IndexTemplateNodeWrite.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesPartialUpdate()`

```php
indexTemplatesPartialUpdate($index_template_id, $data): \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite
```



Partially edit an index template.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite(); // \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite

try {
    $result = $apiInstance->indexTemplatesPartialUpdate($index_template_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite**](../Model/IndexTemplateWrite.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite**](../Model/IndexTemplateWrite.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesRead()`

```php
indexTemplatesRead($index_template_id): \app\App\Edms\OpenAPI\Client\Models\IndexTemplate
```



Returns the details of the selected index template.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string

try {
    $result = $apiInstance->indexTemplatesRead($index_template_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexTemplate**](../Model/IndexTemplate.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `indexTemplatesUpdate()`

```php
indexTemplatesUpdate($index_template_id, $data): \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite
```



Edit an index template.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiIndexTemplatesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$index_template_id = 'index_template_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite(); // \app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite

try {
    $result = $apiInstance->indexTemplatesUpdate($index_template_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling IndexTemplatesApi->indexTemplatesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **index_template_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite**](../Model/IndexTemplateWrite.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\IndexTemplateWrite**](../Model/IndexTemplateWrite.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
