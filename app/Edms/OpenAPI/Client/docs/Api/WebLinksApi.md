# OpenAPI\Client\WebLinksApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**webLinksCreate()**](WebLinksApi.md#webLinksCreate) | **POST** /web_links/ | 
[**webLinksDelete()**](WebLinksApi.md#webLinksDelete) | **DELETE** /web_links/{id}/ | 
[**webLinksList()**](WebLinksApi.md#webLinksList) | **GET** /web_links/ | 
[**webLinksPartialUpdate()**](WebLinksApi.md#webLinksPartialUpdate) | **PATCH** /web_links/{id}/ | 
[**webLinksRead()**](WebLinksApi.md#webLinksRead) | **GET** /web_links/{id}/ | 
[**webLinksUpdate()**](WebLinksApi.md#webLinksUpdate) | **PUT** /web_links/{id}/ | 


## `webLinksCreate()`

```php
webLinksCreate($data): \app\App\Edms\OpenAPI\Client\Models\WritableWebLink
```



Create a new web link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiWebLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWebLink(); // \app\App\Edms\OpenAPI\Client\Models\WritableWebLink

try {
    $result = $apiInstance->webLinksCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebLinksApi->webLinksCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWebLink**](../Model/WritableWebLink.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWebLink**](../Model/WritableWebLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `webLinksDelete()`

```php
webLinksDelete($id)
```



Delete the selected web link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiWebLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Web link.

try {
    $apiInstance->webLinksDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling WebLinksApi->webLinksDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Web link. |

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

## `webLinksList()`

```php
webLinksList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20045
```



Returns a list of all the web links.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiWebLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->webLinksList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebLinksApi->webLinksList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20045**](../Model/InlineResponse20045.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `webLinksPartialUpdate()`

```php
webLinksPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableWebLink
```



Edit the selected web link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiWebLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Web link.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWebLink(); // \app\App\Edms\OpenAPI\Client\Models\WritableWebLink

try {
    $result = $apiInstance->webLinksPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebLinksApi->webLinksPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Web link. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWebLink**](../Model/WritableWebLink.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWebLink**](../Model/WritableWebLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `webLinksRead()`

```php
webLinksRead($id): \app\App\Edms\OpenAPI\Client\Models\WebLink
```



Return the details of the selected web link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiWebLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Web link.

try {
    $result = $apiInstance->webLinksRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebLinksApi->webLinksRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Web link. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WebLink**](../Model/WebLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `webLinksUpdate()`

```php
webLinksUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableWebLink
```



Edit the selected web link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiWebLinksApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Web link.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWebLink(); // \app\App\Edms\OpenAPI\Client\Models\WritableWebLink

try {
    $result = $apiInstance->webLinksUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WebLinksApi->webLinksUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Web link. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWebLink**](../Model/WritableWebLink.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWebLink**](../Model/WritableWebLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
