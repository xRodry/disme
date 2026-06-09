# OpenAPI\Client\MetadataTypesApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**metadataTypesCreate()**](MetadataTypesApi.md#metadataTypesCreate) | **POST** /metadata_types/ | 
[**metadataTypesDelete()**](MetadataTypesApi.md#metadataTypesDelete) | **DELETE** /metadata_types/{metadata_type_pk}/ | 
[**metadataTypesList()**](MetadataTypesApi.md#metadataTypesList) | **GET** /metadata_types/ | 
[**metadataTypesPartialUpdate()**](MetadataTypesApi.md#metadataTypesPartialUpdate) | **PATCH** /metadata_types/{metadata_type_pk}/ | 
[**metadataTypesRead()**](MetadataTypesApi.md#metadataTypesRead) | **GET** /metadata_types/{metadata_type_pk}/ | 
[**metadataTypesUpdate()**](MetadataTypesApi.md#metadataTypesUpdate) | **PUT** /metadata_types/{metadata_type_pk}/ | 


## `metadataTypesCreate()`

```php
metadataTypesCreate($data): \app\App\Edms\OpenAPI\Client\Models\MetadataType
```



Create a new metadata type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiMetadataTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\MetadataType(); // \app\App\Edms\OpenAPI\Client\Models\MetadataType

try {
    $result = $apiInstance->metadataTypesCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MetadataTypesApi->metadataTypesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\MetadataType**](../Model/MetadataType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\MetadataType**](../Model/MetadataType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `metadataTypesDelete()`

```php
metadataTypesDelete($metadata_type_pk)
```



Delete the selected metadata type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiMetadataTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$metadata_type_pk = 'metadata_type_pk_example'; // string

try {
    $apiInstance->metadataTypesDelete($metadata_type_pk);
} catch (Exception $e) {
    echo 'Exception when calling MetadataTypesApi->metadataTypesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metadata_type_pk** | **string**|  |

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

## `metadataTypesList()`

```php
metadataTypesList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20031
```



Returns a list of all the metadata types.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiMetadataTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->metadataTypesList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MetadataTypesApi->metadataTypesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20031**](../Model/InlineResponse20031.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `metadataTypesPartialUpdate()`

```php
metadataTypesPartialUpdate($metadata_type_pk, $data): \app\App\Edms\OpenAPI\Client\Models\MetadataType
```



Edit the selected metadata type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiMetadataTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$metadata_type_pk = 'metadata_type_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\MetadataType(); // \app\App\Edms\OpenAPI\Client\Models\MetadataType

try {
    $result = $apiInstance->metadataTypesPartialUpdate($metadata_type_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MetadataTypesApi->metadataTypesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metadata_type_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\MetadataType**](../Model/MetadataType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\MetadataType**](../Model/MetadataType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `metadataTypesRead()`

```php
metadataTypesRead($metadata_type_pk): \app\App\Edms\OpenAPI\Client\Models\MetadataType
```



Return the details of the selected metadata type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiMetadataTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$metadata_type_pk = 'metadata_type_pk_example'; // string

try {
    $result = $apiInstance->metadataTypesRead($metadata_type_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MetadataTypesApi->metadataTypesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metadata_type_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\MetadataType**](../Model/MetadataType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `metadataTypesUpdate()`

```php
metadataTypesUpdate($metadata_type_pk, $data): \app\App\Edms\OpenAPI\Client\Models\MetadataType
```



Edit the selected metadata type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiMetadataTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$metadata_type_pk = 'metadata_type_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\MetadataType(); // \app\App\Edms\OpenAPI\Client\Models\MetadataType

try {
    $result = $apiInstance->metadataTypesUpdate($metadata_type_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling MetadataTypesApi->metadataTypesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **metadata_type_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\MetadataType**](../Model/MetadataType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\MetadataType**](../Model/MetadataType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
