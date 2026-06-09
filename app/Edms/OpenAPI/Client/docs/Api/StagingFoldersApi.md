# OpenAPI\Client\StagingFoldersApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**stagingFoldersCreate()**](StagingFoldersApi.md#stagingFoldersCreate) | **POST** /staging_folders/ | 
[**stagingFoldersDelete()**](StagingFoldersApi.md#stagingFoldersDelete) | **DELETE** /staging_folders/{id}/ | 
[**stagingFoldersFileDelete()**](StagingFoldersApi.md#stagingFoldersFileDelete) | **DELETE** /staging_folders/file/{staging_folder_pk}/{encoded_filename}/ | 
[**stagingFoldersFileImageRead()**](StagingFoldersApi.md#stagingFoldersFileImageRead) | **GET** /staging_folders/file/{staging_folder_pk}/{encoded_filename}/image/ | 
[**stagingFoldersFileRead()**](StagingFoldersApi.md#stagingFoldersFileRead) | **GET** /staging_folders/file/{staging_folder_pk}/{encoded_filename}/ | 
[**stagingFoldersFileUploadCreate()**](StagingFoldersApi.md#stagingFoldersFileUploadCreate) | **POST** /staging_folders/file/{staging_folder_pk}/{encoded_filename}/upload/ | 
[**stagingFoldersList()**](StagingFoldersApi.md#stagingFoldersList) | **GET** /staging_folders/ | 
[**stagingFoldersPartialUpdate()**](StagingFoldersApi.md#stagingFoldersPartialUpdate) | **PATCH** /staging_folders/{id}/ | 
[**stagingFoldersRead()**](StagingFoldersApi.md#stagingFoldersRead) | **GET** /staging_folders/{id}/ | 
[**stagingFoldersUpdate()**](StagingFoldersApi.md#stagingFoldersUpdate) | **PUT** /staging_folders/{id}/ | 


## `stagingFoldersCreate()`

```php
stagingFoldersCreate($data): \app\App\Edms\OpenAPI\Client\Models\StagingFolder
```



Create a new staging folders.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\StagingFolder(); // \app\App\Edms\OpenAPI\Client\Models\StagingFolder

try {
    $result = $apiInstance->stagingFoldersCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\StagingFolder**](../Model/StagingFolder.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\StagingFolder**](../Model/StagingFolder.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `stagingFoldersDelete()`

```php
stagingFoldersDelete($id)
```



Delete the selected staging folders.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Staging folder.

try {
    $apiInstance->stagingFoldersDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Staging folder. |

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

## `stagingFoldersFileDelete()`

```php
stagingFoldersFileDelete($encoded_filename, $staging_folder_pk)
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$encoded_filename = 'encoded_filename_example'; // string
$staging_folder_pk = 'staging_folder_pk_example'; // string

try {
    $apiInstance->stagingFoldersFileDelete($encoded_filename, $staging_folder_pk);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersFileDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **encoded_filename** | **string**|  |
 **staging_folder_pk** | **string**|  |

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

## `stagingFoldersFileImageRead()`

```php
stagingFoldersFileImageRead($encoded_filename, $staging_folder_pk)
```



Returns an image representation of the selected staging folder file.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$encoded_filename = 'encoded_filename_example'; // string
$staging_folder_pk = 'staging_folder_pk_example'; // string

try {
    $apiInstance->stagingFoldersFileImageRead($encoded_filename, $staging_folder_pk);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersFileImageRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **encoded_filename** | **string**|  |
 **staging_folder_pk** | **string**|  |

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

## `stagingFoldersFileRead()`

```php
stagingFoldersFileRead($encoded_filename, $staging_folder_pk): \app\App\Edms\OpenAPI\Client\Models\StagingFolderFile
```



Details of the selected staging file.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$encoded_filename = 'encoded_filename_example'; // string
$staging_folder_pk = 'staging_folder_pk_example'; // string

try {
    $result = $apiInstance->stagingFoldersFileRead($encoded_filename, $staging_folder_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersFileRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **encoded_filename** | **string**|  |
 **staging_folder_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\StagingFolderFile**](../Model/StagingFolderFile.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `stagingFoldersFileUploadCreate()`

```php
stagingFoldersFileUploadCreate($encoded_filename, $staging_folder_pk, $data): \app\App\Edms\OpenAPI\Client\Models\StagingFolderFileUpload
```



Upload the selected staging folder file.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$encoded_filename = 'encoded_filename_example'; // string
$staging_folder_pk = 'staging_folder_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\StagingFolderFileUpload(); // \app\App\Edms\OpenAPI\Client\Models\StagingFolderFileUpload

try {
    $result = $apiInstance->stagingFoldersFileUploadCreate($encoded_filename, $staging_folder_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersFileUploadCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **encoded_filename** | **string**|  |
 **staging_folder_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\StagingFolderFileUpload**](../Model/StagingFolderFileUpload.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\StagingFolderFileUpload**](../Model/StagingFolderFileUpload.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `stagingFoldersList()`

```php
stagingFoldersList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20040
```



Returns a list of all the staging folders and the files they contain.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->stagingFoldersList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20040**](../Model/InlineResponse20040.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `stagingFoldersPartialUpdate()`

```php
stagingFoldersPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\StagingFolder
```



Edit the selected staging folders.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Staging folder.
$data = new \app\App\Edms\OpenAPI\Client\Models\StagingFolder(); // \app\App\Edms\OpenAPI\Client\Models\StagingFolder

try {
    $result = $apiInstance->stagingFoldersPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Staging folder. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\StagingFolder**](../Model/StagingFolder.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\StagingFolder**](../Model/StagingFolder.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `stagingFoldersRead()`

```php
stagingFoldersRead($id): \app\App\Edms\OpenAPI\Client\Models\StagingFolder
```



Details of the selected staging folders and the files it contains.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Staging folder.

try {
    $result = $apiInstance->stagingFoldersRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Staging folder. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\StagingFolder**](../Model/StagingFolder.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `stagingFoldersUpdate()`

```php
stagingFoldersUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\StagingFolder
```



Edit the selected staging folders.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiStagingFoldersApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Staging folder.
$data = new \app\App\Edms\OpenAPI\Client\Models\StagingFolder(); // \app\App\Edms\OpenAPI\Client\Models\StagingFolder

try {
    $result = $apiInstance->stagingFoldersUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling StagingFoldersApi->stagingFoldersUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Staging folder. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\StagingFolder**](../Model/StagingFolder.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\StagingFolder**](../Model/StagingFolder.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
