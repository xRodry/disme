# OpenAPI\Client\CabinetsApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**cabinetsCreate()**](CabinetsApi.md#cabinetsCreate) | **POST** /cabinets/ | 
[**cabinetsDelete()**](CabinetsApi.md#cabinetsDelete) | **DELETE** /cabinets/{id}/ | 
[**cabinetsDocumentsCreate()**](CabinetsApi.md#cabinetsDocumentsCreate) | **POST** /cabinets/{id}/documents/ | 
[**cabinetsDocumentsDelete()**](CabinetsApi.md#cabinetsDocumentsDelete) | **DELETE** /cabinets/{id}/documents/{document_pk}/ | 
[**cabinetsDocumentsList()**](CabinetsApi.md#cabinetsDocumentsList) | **GET** /cabinets/{id}/documents/ | 
[**cabinetsDocumentsRead()**](CabinetsApi.md#cabinetsDocumentsRead) | **GET** /cabinets/{id}/documents/{document_pk}/ | 
[**cabinetsList()**](CabinetsApi.md#cabinetsList) | **GET** /cabinets/ | 
[**cabinetsPartialUpdate()**](CabinetsApi.md#cabinetsPartialUpdate) | **PATCH** /cabinets/{id}/ | 
[**cabinetsRead()**](CabinetsApi.md#cabinetsRead) | **GET** /cabinets/{id}/ | 
[**cabinetsUpdate()**](CabinetsApi.md#cabinetsUpdate) | **PUT** /cabinets/{id}/ | 


## `cabinetsCreate()`

```php
cabinetsCreate($data): \App\Edms\OpenAPI\Client\Models\WritableCabinet
```



Create a new cabinet

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \App\Edms\OpenAPI\Client\Models\WritableCabinet(); // \app\App\Edms\OpenAPI\Client\Models\WritableCabinet

try {
    $result = $apiInstance->cabinetsCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableCabinet**](../Model/WritableCabinet.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableCabinet**](../Model/WritableCabinet.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `cabinetsDelete()`

```php
cabinetsDelete($id)
```



Delete the selected cabinet.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Cabinet.

try {
    $apiInstance->cabinetsDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Cabinet. |

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

## `cabinetsDocumentsCreate()`

```php
cabinetsDocumentsCreate($id, $data): \app\App\Edms\OpenAPI\Client\Models\NewCabinetDocument
```



Add a document to the selected cabinet.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\NewCabinetDocument(); // \app\App\Edms\OpenAPI\Client\Models\NewCabinetDocument

try {
    $result = $apiInstance->cabinetsDocumentsCreate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsDocumentsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\NewCabinetDocument**](../Model/NewCabinetDocument.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\NewCabinetDocument**](../Model/NewCabinetDocument.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `cabinetsDocumentsDelete()`

```php
cabinetsDocumentsDelete($document_pk, $id)
```



Remove a document from the selected cabinet.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$id = 'id_example'; // string

try {
    $apiInstance->cabinetsDocumentsDelete($document_pk, $id);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsDocumentsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
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

## `cabinetsDocumentsList()`

```php
cabinetsDocumentsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2001
```



Returns a list of all the documents contained in a particular cabinet.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->cabinetsDocumentsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsDocumentsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse2001**](../Model/InlineResponse2001.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `cabinetsDocumentsRead()`

```php
cabinetsDocumentsRead($document_pk, $id): \app\App\Edms\OpenAPI\Client\Models\CabinetDocument
```



Returns the details of the selected cabinet document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$id = 'id_example'; // string

try {
    $result = $apiInstance->cabinetsDocumentsRead($document_pk, $id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsDocumentsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\CabinetDocument**](../Model/CabinetDocument.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `cabinetsList()`

```php
cabinetsList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse200
```



Returns a list of all the cabinets.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->cabinetsList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse200**](../Model/InlineResponse200.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `cabinetsPartialUpdate()`

```php
cabinetsPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableCabinet
```



Edit the selected cabinet.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Cabinet.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableCabinet(); // \app\App\Edms\OpenAPI\Client\Models\WritableCabinet

try {
    $result = $apiInstance->cabinetsPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Cabinet. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableCabinet**](../Model/WritableCabinet.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableCabinet**](../Model/WritableCabinet.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `cabinetsRead()`

```php
cabinetsRead($id): \app\App\Edms\OpenAPI\Client\Models\Cabinet
```



Returns the details of the selected cabinet.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Cabinet.

try {
    $result = $apiInstance->cabinetsRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Cabinet. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Cabinet**](../Model/Cabinet.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `cabinetsUpdate()`

```php
cabinetsUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableCabinet
```



Edit the selected cabinet.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiCabinetsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Cabinet.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableCabinet(); // \app\App\Edms\OpenAPI\Client\Models\WritableCabinet

try {
    $result = $apiInstance->cabinetsUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling CabinetsApi->cabinetsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Cabinet. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableCabinet**](../Model/WritableCabinet.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableCabinet**](../Model/WritableCabinet.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
