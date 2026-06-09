# OpenAPI\Client\DocumentTypesApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**documentTypesCreate()**](DocumentTypesApi.md#documentTypesCreate) | **POST** /document_types/ | 
[**documentTypesDelete()**](DocumentTypesApi.md#documentTypesDelete) | **DELETE** /document_types/{id}/ | 
[**documentTypesDocumentsList()**](DocumentTypesApi.md#documentTypesDocumentsList) | **GET** /document_types/{id}/documents/ | 
[**documentTypesList()**](DocumentTypesApi.md#documentTypesList) | **GET** /document_types/ | 
[**documentTypesMetadataTypesCreate()**](DocumentTypesApi.md#documentTypesMetadataTypesCreate) | **POST** /document_types/{document_type_pk}/metadata_types/ | 
[**documentTypesMetadataTypesDelete()**](DocumentTypesApi.md#documentTypesMetadataTypesDelete) | **DELETE** /document_types/{document_type_pk}/metadata_types/{metadata_type_pk}/ | 
[**documentTypesMetadataTypesList()**](DocumentTypesApi.md#documentTypesMetadataTypesList) | **GET** /document_types/{document_type_pk}/metadata_types/ | 
[**documentTypesMetadataTypesPartialUpdate()**](DocumentTypesApi.md#documentTypesMetadataTypesPartialUpdate) | **PATCH** /document_types/{document_type_pk}/metadata_types/{metadata_type_pk}/ | 
[**documentTypesMetadataTypesRead()**](DocumentTypesApi.md#documentTypesMetadataTypesRead) | **GET** /document_types/{document_type_pk}/metadata_types/{metadata_type_pk}/ | 
[**documentTypesMetadataTypesUpdate()**](DocumentTypesApi.md#documentTypesMetadataTypesUpdate) | **PUT** /document_types/{document_type_pk}/metadata_types/{metadata_type_pk}/ | 
[**documentTypesOcrSettingsPartialUpdate()**](DocumentTypesApi.md#documentTypesOcrSettingsPartialUpdate) | **PATCH** /document_types/{id}/ocr/settings/ | 
[**documentTypesOcrSettingsRead()**](DocumentTypesApi.md#documentTypesOcrSettingsRead) | **GET** /document_types/{id}/ocr/settings/ | 
[**documentTypesOcrSettingsUpdate()**](DocumentTypesApi.md#documentTypesOcrSettingsUpdate) | **PUT** /document_types/{id}/ocr/settings/ | 
[**documentTypesParsingSettingsPartialUpdate()**](DocumentTypesApi.md#documentTypesParsingSettingsPartialUpdate) | **PATCH** /document_types/{id}/parsing/settings/ | 
[**documentTypesParsingSettingsRead()**](DocumentTypesApi.md#documentTypesParsingSettingsRead) | **GET** /document_types/{id}/parsing/settings/ | 
[**documentTypesParsingSettingsUpdate()**](DocumentTypesApi.md#documentTypesParsingSettingsUpdate) | **PUT** /document_types/{id}/parsing/settings/ | 
[**documentTypesPartialUpdate()**](DocumentTypesApi.md#documentTypesPartialUpdate) | **PATCH** /document_types/{id}/ | 
[**documentTypesRead()**](DocumentTypesApi.md#documentTypesRead) | **GET** /document_types/{id}/ | 
[**documentTypesUpdate()**](DocumentTypesApi.md#documentTypesUpdate) | **PUT** /document_types/{id}/ | 
[**documentTypesWorkflowsList()**](DocumentTypesApi.md#documentTypesWorkflowsList) | **GET** /document_types/{id}/workflows/ | 


## `documentTypesCreate()`

```php
documentTypesCreate($data): \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType
```



Create a new document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType

try {
    $result = $apiInstance->documentTypesCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentType**](../Model/WritableDocumentType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentType**](../Model/WritableDocumentType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesDelete()`

```php
documentTypesDelete($id)
```



Delete the selected document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type.

try {
    $apiInstance->documentTypesDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type. |

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

## `documentTypesDocumentsList()`

```php
documentTypesDocumentsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2006
```



Returns a list of all the documents of a particular document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentTypesDocumentsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesDocumentsList: ', $e->getMessage(), PHP_EOL;
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

## `documentTypesList()`

```php
documentTypesList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2004
```



Returns a list of all the document types.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentTypesList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse2004**](../Model/InlineResponse2004.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesMetadataTypesCreate()`

```php
documentTypesMetadataTypesCreate($document_type_pk, $data): \app\App\Edms\OpenAPI\Client\Models\NewDocumentTypeMetadataType
```



Add a metadata type to the selected document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_type_pk = 'document_type_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\NewDocumentTypeMetadataType(); // \app\App\Edms\OpenAPI\Client\Models\NewDocumentTypeMetadataType

try {
    $result = $apiInstance->documentTypesMetadataTypesCreate($document_type_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesMetadataTypesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_type_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\NewDocumentTypeMetadataType**](../Model/NewDocumentTypeMetadataType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\NewDocumentTypeMetadataType**](../Model/NewDocumentTypeMetadataType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesMetadataTypesDelete()`

```php
documentTypesMetadataTypesDelete($document_type_pk, $metadata_type_pk)
```



Remove a metadata type from a document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_type_pk = 'document_type_pk_example'; // string
$metadata_type_pk = 'metadata_type_pk_example'; // string

try {
    $apiInstance->documentTypesMetadataTypesDelete($document_type_pk, $metadata_type_pk);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesMetadataTypesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_type_pk** | **string**|  |
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

## `documentTypesMetadataTypesList()`

```php
documentTypesMetadataTypesList($document_type_pk, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2005
```



Returns a list of selected document type's metadata types.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_type_pk = 'document_type_pk_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentTypesMetadataTypesList($document_type_pk, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesMetadataTypesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_type_pk** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse2005**](../Model/InlineResponse2005.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesMetadataTypesPartialUpdate()`

```php
documentTypesMetadataTypesPartialUpdate($document_type_pk, $metadata_type_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType
```



Edit the selected document type metadata type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_type_pk = 'document_type_pk_example'; // string
$metadata_type_pk = 'metadata_type_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType

try {
    $result = $apiInstance->documentTypesMetadataTypesPartialUpdate($document_type_pk, $metadata_type_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesMetadataTypesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_type_pk** | **string**|  |
 **metadata_type_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType**](../Model/WritableDocumentTypeMetadataType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType**](../Model/WritableDocumentTypeMetadataType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesMetadataTypesRead()`

```php
documentTypesMetadataTypesRead($document_type_pk, $metadata_type_pk): \app\App\Edms\OpenAPI\Client\Models\DocumentTypeMetadataType
```



Retrieve the details of a document type metadata type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_type_pk = 'document_type_pk_example'; // string
$metadata_type_pk = 'metadata_type_pk_example'; // string

try {
    $result = $apiInstance->documentTypesMetadataTypesRead($document_type_pk, $metadata_type_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesMetadataTypesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_type_pk** | **string**|  |
 **metadata_type_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeMetadataType**](../Model/DocumentTypeMetadataType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesMetadataTypesUpdate()`

```php
documentTypesMetadataTypesUpdate($document_type_pk, $metadata_type_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType
```



Edit the selected document type metadata type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_type_pk = 'document_type_pk_example'; // string
$metadata_type_pk = 'metadata_type_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType

try {
    $result = $apiInstance->documentTypesMetadataTypesUpdate($document_type_pk, $metadata_type_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesMetadataTypesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_type_pk** | **string**|  |
 **metadata_type_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType**](../Model/WritableDocumentTypeMetadataType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentTypeMetadataType**](../Model/WritableDocumentTypeMetadataType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesOcrSettingsPartialUpdate()`

```php
documentTypesOcrSettingsPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings
```



Set the document type OCR settings.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type settings.
$data = new \app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings(); // \app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings

try {
    $result = $apiInstance->documentTypesOcrSettingsPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesOcrSettingsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type settings. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings**](../Model/DocumentTypeOCRSettings.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings**](../Model/DocumentTypeOCRSettings.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesOcrSettingsRead()`

```php
documentTypesOcrSettingsRead($id): \app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings
```



Return the document type OCR settings.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type settings.

try {
    $result = $apiInstance->documentTypesOcrSettingsRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesOcrSettingsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type settings. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings**](../Model/DocumentTypeOCRSettings.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesOcrSettingsUpdate()`

```php
documentTypesOcrSettingsUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings
```



Set the document type OCR settings.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type settings.
$data = new \app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings(); // \app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings

try {
    $result = $apiInstance->documentTypesOcrSettingsUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesOcrSettingsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type settings. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings**](../Model/DocumentTypeOCRSettings.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeOCRSettings**](../Model/DocumentTypeOCRSettings.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesParsingSettingsPartialUpdate()`

```php
documentTypesParsingSettingsPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings
```



Set the document type parsing settings.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type settings.
$data = new \app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings(); // \app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings

try {
    $result = $apiInstance->documentTypesParsingSettingsPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesParsingSettingsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type settings. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings**](../Model/DocumentTypeParsingSettings.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings**](../Model/DocumentTypeParsingSettings.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesParsingSettingsRead()`

```php
documentTypesParsingSettingsRead($id): \app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings
```



Return the document type parsing settings.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type settings.

try {
    $result = $apiInstance->documentTypesParsingSettingsRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesParsingSettingsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type settings. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings**](../Model/DocumentTypeParsingSettings.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesParsingSettingsUpdate()`

```php
documentTypesParsingSettingsUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings
```



Set the document type parsing settings.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type settings.
$data = new \app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings(); // \app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings

try {
    $result = $apiInstance->documentTypesParsingSettingsUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesParsingSettingsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type settings. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings**](../Model/DocumentTypeParsingSettings.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentTypeParsingSettings**](../Model/DocumentTypeParsingSettings.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesPartialUpdate()`

```php
documentTypesPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType
```



Edit the properties of the selected document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType

try {
    $result = $apiInstance->documentTypesPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentType**](../Model/WritableDocumentType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentType**](../Model/WritableDocumentType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesRead()`

```php
documentTypesRead($id): \app\App\Edms\OpenAPI\Client\Models\DocumentType
```



Return the details of the selected document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type.

try {
    $result = $apiInstance->documentTypesRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentType**](../Model/DocumentType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesUpdate()`

```php
documentTypesUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType
```



Edit the properties of the selected document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document type.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocumentType

try {
    $result = $apiInstance->documentTypesUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document type. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentType**](../Model/WritableDocumentType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentType**](../Model/WritableDocumentType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentTypesWorkflowsList()`

```php
documentTypesWorkflowsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2007
```



Returns a list of all the document type workflows.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentTypesApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentTypesWorkflowsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentTypesApi->documentTypesWorkflowsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse2007**](../Model/InlineResponse2007.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
