# OpenAPI\Client\SmartLinksApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**smartLinksConditionsCreate()**](SmartLinksApi.md#smartLinksConditionsCreate) | **POST** /smart_links/{id}/conditions/ | 
[**smartLinksConditionsDelete()**](SmartLinksApi.md#smartLinksConditionsDelete) | **DELETE** /smart_links/{id}/conditions/{condition_pk}/ | 
[**smartLinksConditionsList()**](SmartLinksApi.md#smartLinksConditionsList) | **GET** /smart_links/{id}/conditions/ | 
[**smartLinksConditionsPartialUpdate()**](SmartLinksApi.md#smartLinksConditionsPartialUpdate) | **PATCH** /smart_links/{id}/conditions/{condition_pk}/ | 
[**smartLinksConditionsRead()**](SmartLinksApi.md#smartLinksConditionsRead) | **GET** /smart_links/{id}/conditions/{condition_pk}/ | 
[**smartLinksConditionsUpdate()**](SmartLinksApi.md#smartLinksConditionsUpdate) | **PUT** /smart_links/{id}/conditions/{condition_pk}/ | 
[**smartLinksCreate()**](SmartLinksApi.md#smartLinksCreate) | **POST** /smart_links/ | 
[**smartLinksDelete()**](SmartLinksApi.md#smartLinksDelete) | **DELETE** /smart_links/{id}/ | 
[**smartLinksList()**](SmartLinksApi.md#smartLinksList) | **GET** /smart_links/ | 
[**smartLinksPartialUpdate()**](SmartLinksApi.md#smartLinksPartialUpdate) | **PATCH** /smart_links/{id}/ | 
[**smartLinksRead()**](SmartLinksApi.md#smartLinksRead) | **GET** /smart_links/{id}/ | 
[**smartLinksUpdate()**](SmartLinksApi.md#smartLinksUpdate) | **PUT** /smart_links/{id}/ | 


## `smartLinksConditionsCreate()`

```php
smartLinksConditionsCreate($id, $data): \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition
```



Create a new smart link condition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition(); // \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition

try {
    $result = $apiInstance->smartLinksConditionsCreate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksConditionsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition**](../Model/SmartLinkCondition.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition**](../Model/SmartLinkCondition.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksConditionsDelete()`

```php
smartLinksConditionsDelete($condition_pk, $id)
```



Delete the selected smart link condition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$condition_pk = 'condition_pk_example'; // string
$id = 'id_example'; // string

try {
    $apiInstance->smartLinksConditionsDelete($condition_pk, $id);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksConditionsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **condition_pk** | **string**|  |
 **id** | **string**|  |

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

## `smartLinksConditionsList()`

```php
smartLinksConditionsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20039
```



Returns a list of all the smart link conditions.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->smartLinksConditionsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksConditionsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20039**](../Model/InlineResponse20039.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksConditionsPartialUpdate()`

```php
smartLinksConditionsPartialUpdate($condition_pk, $id, $data): \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition
```



Edit the selected smart link condition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$condition_pk = 'condition_pk_example'; // string
$id = 'id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition(); // \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition

try {
    $result = $apiInstance->smartLinksConditionsPartialUpdate($condition_pk, $id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksConditionsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **condition_pk** | **string**|  |
 **id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition**](../Model/SmartLinkCondition.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition**](../Model/SmartLinkCondition.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksConditionsRead()`

```php
smartLinksConditionsRead($condition_pk, $id): \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition
```



Return the details of the selected smart link condition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$condition_pk = 'condition_pk_example'; // string
$id = 'id_example'; // string

try {
    $result = $apiInstance->smartLinksConditionsRead($condition_pk, $id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksConditionsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **condition_pk** | **string**|  |
 **id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition**](../Model/SmartLinkCondition.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksConditionsUpdate()`

```php
smartLinksConditionsUpdate($condition_pk, $id, $data): \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition
```



Edit the selected smart link condition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$condition_pk = 'condition_pk_example'; // string
$id = 'id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition(); // \app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition

try {
    $result = $apiInstance->smartLinksConditionsUpdate($condition_pk, $id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksConditionsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **condition_pk** | **string**|  |
 **id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition**](../Model/SmartLinkCondition.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\SmartLinkCondition**](../Model/SmartLinkCondition.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksCreate()`

```php
smartLinksCreate($data): \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink
```



Create a new smart link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink(); // \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink

try {
    $result = $apiInstance->smartLinksCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableSmartLink**](../Model/WritableSmartLink.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableSmartLink**](../Model/WritableSmartLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksDelete()`

```php
smartLinksDelete($id)
```



Delete the selected smart link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Smart link.

try {
    $apiInstance->smartLinksDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Smart link. |

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

## `smartLinksList()`

```php
smartLinksList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20038
```



Returns a list of all the smart links.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->smartLinksList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20038**](../Model/InlineResponse20038.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksPartialUpdate()`

```php
smartLinksPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink
```



Edit the selected smart link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Smart link.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink(); // \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink

try {
    $result = $apiInstance->smartLinksPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Smart link. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableSmartLink**](../Model/WritableSmartLink.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableSmartLink**](../Model/WritableSmartLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksRead()`

```php
smartLinksRead($id): \app\App\Edms\OpenAPI\Client\Models\SmartLink
```



Return the details of the selected smart link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Smart link.

try {
    $result = $apiInstance->smartLinksRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Smart link. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\SmartLink**](../Model/SmartLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `smartLinksUpdate()`

```php
smartLinksUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink
```



Edit the selected smart link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiSmartLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Smart link.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink(); // \app\App\Edms\OpenAPI\Client\Models\WritableSmartLink

try {
    $result = $apiInstance->smartLinksUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling SmartLinksApi->smartLinksUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Smart link. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableSmartLink**](../Model/WritableSmartLink.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableSmartLink**](../Model/WritableSmartLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
