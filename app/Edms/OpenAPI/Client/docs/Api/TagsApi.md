# OpenAPI\Client\TagsApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**tagsCreate()**](TagsApi.md#tagsCreate) | **POST** /tags/ | 
[**tagsDelete()**](TagsApi.md#tagsDelete) | **DELETE** /tags/{id}/ | 
[**tagsDocumentsList()**](TagsApi.md#tagsDocumentsList) | **GET** /tags/{id}/documents/ | 
[**tagsList()**](TagsApi.md#tagsList) | **GET** /tags/ | 
[**tagsPartialUpdate()**](TagsApi.md#tagsPartialUpdate) | **PATCH** /tags/{id}/ | 
[**tagsRead()**](TagsApi.md#tagsRead) | **GET** /tags/{id}/ | 
[**tagsUpdate()**](TagsApi.md#tagsUpdate) | **PUT** /tags/{id}/ | 


## `tagsCreate()`

```php
tagsCreate($data): \app\App\Edms\OpenAPI\Client\Models\WritableTag
```



Create a new tag.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiTagsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableTag(); // \app\App\Edms\OpenAPI\Client\Models\WritableTag

try {
    $result = $apiInstance->tagsCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TagsApi->tagsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableTag**](../Model/WritableTag.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableTag**](../Model/WritableTag.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tagsDelete()`

```php
tagsDelete($id)
```



Delete the selected tag.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiTagsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Tag.

try {
    $apiInstance->tagsDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling TagsApi->tagsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Tag. |

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

## `tagsDocumentsList()`

```php
tagsDocumentsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2006
```



Returns a list of all the documents tagged by a particular tag.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiTagsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->tagsDocumentsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TagsApi->tagsDocumentsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
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

## `tagsList()`

```php
tagsList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20041
```



Returns a list of all the tags.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiTagsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->tagsList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TagsApi->tagsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20041**](../Model/InlineResponse20041.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tagsPartialUpdate()`

```php
tagsPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableTag
```



Edit the selected tag.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiTagsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Tag.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableTag(); // \app\App\Edms\OpenAPI\Client\Models\WritableTag

try {
    $result = $apiInstance->tagsPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TagsApi->tagsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Tag. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableTag**](../Model/WritableTag.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableTag**](../Model/WritableTag.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tagsRead()`

```php
tagsRead($id): \app\App\Edms\OpenAPI\Client\Models\Tag
```



Return the details of the selected tag.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiTagsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Tag.

try {
    $result = $apiInstance->tagsRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TagsApi->tagsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Tag. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Tag**](../Model/Tag.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `tagsUpdate()`

```php
tagsUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableTag
```



Edit the selected tag.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiTagsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Tag.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableTag(); // \app\App\Edms\OpenAPI\Client\Models\WritableTag

try {
    $result = $apiInstance->tagsUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling TagsApi->tagsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Tag. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableTag**](../Model/WritableTag.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableTag**](../Model/WritableTag.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
