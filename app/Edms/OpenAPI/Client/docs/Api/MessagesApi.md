# OpenAPI\Client\MessagesApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**messagesCreate()**](MessagesApi.md#messagesCreate) | **POST** /messages/ | 
[**messagesDelete()**](MessagesApi.md#messagesDelete) | **DELETE** /messages/{id}/ | 
[**messagesList()**](MessagesApi.md#messagesList) | **GET** /messages/ | 
[**messagesPartialUpdate()**](MessagesApi.md#messagesPartialUpdate) | **PATCH** /messages/{id}/ | 
[**messagesRead()**](MessagesApi.md#messagesRead) | **GET** /messages/{id}/ | 
[**messagesUpdate()**](MessagesApi.md#messagesUpdate) | **PUT** /messages/{id}/ | 


## `messagesCreate()`

```php
messagesCreate($data): \app\App\Edms\OpenAPI\Client\Models\Message
```



Create a new message.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiMessagesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\Message(); // \app\App\Edms\OpenAPI\Client\Models\Message

try {
    $result = $apiInstance->messagesCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MessagesApi->messagesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\Message**](../Model/Message.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Message**](../Model/Message.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `messagesDelete()`

```php
messagesDelete($id)
```



Delete the selected message.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiMessagesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Message.

try {
    $apiInstance->messagesDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling MessagesApi->messagesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Message. |

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

## `messagesList()`

```php
messagesList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20030
```



Returns a list of all the messages.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiMessagesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->messagesList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MessagesApi->messagesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20030**](../Model/InlineResponse20030.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `messagesPartialUpdate()`

```php
messagesPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\Message
```



Edit the selected message.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiMessagesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Message.
$data = new \app\App\Edms\OpenAPI\Client\Models\Message(); // \app\App\Edms\OpenAPI\Client\Models\Message

try {
    $result = $apiInstance->messagesPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MessagesApi->messagesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Message. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\Message**](../Model/Message.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Message**](../Model/Message.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `messagesRead()`

```php
messagesRead($id): \app\App\Edms\OpenAPI\Client\Models\Message
```



Return the details of the selected message.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiMessagesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Message.

try {
    $result = $apiInstance->messagesRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MessagesApi->messagesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Message. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Message**](../Model/Message.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `messagesUpdate()`

```php
messagesUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\Message
```



Edit the selected message.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiMessagesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Message.
$data = new \app\App\Edms\OpenAPI\Client\Models\Message(); // \app\App\Edms\OpenAPI\Client\Models\Message

try {
    $result = $apiInstance->messagesUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MessagesApi->messagesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Message. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\Message**](../Model/Message.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Message**](../Model/Message.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
