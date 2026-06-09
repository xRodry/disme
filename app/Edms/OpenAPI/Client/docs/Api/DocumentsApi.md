# OpenAPI\Client\DocumentsApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**documentsCabinetsList()**](DocumentsApi.md#documentsCabinetsList) | **GET** /documents/{id}/cabinets/ | 
[**documentsCommentsCreate()**](DocumentsApi.md#documentsCommentsCreate) | **POST** /documents/{document_pk}/comments/ | 
[**documentsCommentsDelete()**](DocumentsApi.md#documentsCommentsDelete) | **DELETE** /documents/{document_pk}/comments/{comment_pk}/ | 
[**documentsCommentsList()**](DocumentsApi.md#documentsCommentsList) | **GET** /documents/{document_pk}/comments/ | 
[**documentsCommentsPartialUpdate()**](DocumentsApi.md#documentsCommentsPartialUpdate) | **PATCH** /documents/{document_pk}/comments/{comment_pk}/ | 
[**documentsCommentsRead()**](DocumentsApi.md#documentsCommentsRead) | **GET** /documents/{document_pk}/comments/{comment_pk}/ | 
[**documentsCommentsUpdate()**](DocumentsApi.md#documentsCommentsUpdate) | **PUT** /documents/{document_pk}/comments/{comment_pk}/ | 
[**documentsCreate()**](DocumentsApi.md#documentsCreate) | **POST** /documents/ | 
[**documentsDelete()**](DocumentsApi.md#documentsDelete) | **DELETE** /documents/{id}/ | 
[**documentsDownloadRead()**](DocumentsApi.md#documentsDownloadRead) | **GET** /documents/{id}/download/ | 
[**documentsIndexesList()**](DocumentsApi.md#documentsIndexesList) | **GET** /documents/{document_id}/indexes/ | 
[**documentsList()**](DocumentsApi.md#documentsList) | **GET** /documents/ | 
[**documentsMetadataCreate()**](DocumentsApi.md#documentsMetadataCreate) | **POST** /documents/{document_pk}/metadata/ | 
[**documentsMetadataDelete()**](DocumentsApi.md#documentsMetadataDelete) | **DELETE** /documents/{document_pk}/metadata/{metadata_pk}/ | 
[**documentsMetadataList()**](DocumentsApi.md#documentsMetadataList) | **GET** /documents/{document_pk}/metadata/ | 
[**documentsMetadataPartialUpdate()**](DocumentsApi.md#documentsMetadataPartialUpdate) | **PATCH** /documents/{document_pk}/metadata/{metadata_pk}/ | 
[**documentsMetadataRead()**](DocumentsApi.md#documentsMetadataRead) | **GET** /documents/{document_pk}/metadata/{metadata_pk}/ | 
[**documentsMetadataUpdate()**](DocumentsApi.md#documentsMetadataUpdate) | **PUT** /documents/{document_pk}/metadata/{metadata_pk}/ | 
[**documentsOcrSubmitCreate()**](DocumentsApi.md#documentsOcrSubmitCreate) | **POST** /documents/{id}/ocr/submit/ | 
[**documentsPartialUpdate()**](DocumentsApi.md#documentsPartialUpdate) | **PATCH** /documents/{id}/ | 
[**documentsRead()**](DocumentsApi.md#documentsRead) | **GET** /documents/{id}/ | 
[**documentsRecentList()**](DocumentsApi.md#documentsRecentList) | **GET** /documents/recent/ | 
[**documentsResolvedSmartLinksDocumentsList()**](DocumentsApi.md#documentsResolvedSmartLinksDocumentsList) | **GET** /documents/{id}/resolved_smart_links/{smart_link_pk}/documents/ | 
[**documentsResolvedSmartLinksList()**](DocumentsApi.md#documentsResolvedSmartLinksList) | **GET** /documents/{id}/resolved_smart_links/ | 
[**documentsResolvedSmartLinksRead()**](DocumentsApi.md#documentsResolvedSmartLinksRead) | **GET** /documents/{id}/resolved_smart_links/{smart_link_pk}/ | 
[**documentsResolvedWebLinksList()**](DocumentsApi.md#documentsResolvedWebLinksList) | **GET** /documents/{id}/resolved_web_links/ | 
[**documentsResolvedWebLinksNavigateRead()**](DocumentsApi.md#documentsResolvedWebLinksNavigateRead) | **GET** /documents/{id}/resolved_web_links/{resolved_web_link_pk}/navigate/ | 
[**documentsResolvedWebLinksRead()**](DocumentsApi.md#documentsResolvedWebLinksRead) | **GET** /documents/{id}/resolved_web_links/{resolved_web_link_pk}/ | 
[**documentsTagsCreate()**](DocumentsApi.md#documentsTagsCreate) | **POST** /documents/{document_pk}/tags/ | 
[**documentsTagsDelete()**](DocumentsApi.md#documentsTagsDelete) | **DELETE** /documents/{document_pk}/tags/{id}/ | 
[**documentsTagsList()**](DocumentsApi.md#documentsTagsList) | **GET** /documents/{document_pk}/tags/ | 
[**documentsTagsRead()**](DocumentsApi.md#documentsTagsRead) | **GET** /documents/{document_pk}/tags/{id}/ | 
[**documentsTypeChangeCreate()**](DocumentsApi.md#documentsTypeChangeCreate) | **POST** /documents/{id}/type/change/ | 
[**documentsUpdate()**](DocumentsApi.md#documentsUpdate) | **PUT** /documents/{id}/ | 
[**documentsVersionsCreate()**](DocumentsApi.md#documentsVersionsCreate) | **POST** /documents/{id}/versions/ | 
[**documentsVersionsDelete()**](DocumentsApi.md#documentsVersionsDelete) | **DELETE** /documents/{id}/versions/{version_pk}/ | 
[**documentsVersionsDownloadRead()**](DocumentsApi.md#documentsVersionsDownloadRead) | **GET** /documents/{id}/versions/{version_pk}/download/ | 
[**documentsVersionsList()**](DocumentsApi.md#documentsVersionsList) | **GET** /documents/{id}/versions/ | 
[**documentsVersionsOcrCreate()**](DocumentsApi.md#documentsVersionsOcrCreate) | **POST** /documents/{document_pk}/versions/{version_pk}/ocr/ | 
[**documentsVersionsPagesContentRead()**](DocumentsApi.md#documentsVersionsPagesContentRead) | **GET** /documents/{document_pk}/versions/{version_pk}/pages/{page_pk}/content/ | 
[**documentsVersionsPagesImageRead()**](DocumentsApi.md#documentsVersionsPagesImageRead) | **GET** /documents/{id}/versions/{version_pk}/pages/{page_pk}/image/ | 
[**documentsVersionsPagesList()**](DocumentsApi.md#documentsVersionsPagesList) | **GET** /documents/{id}/versions/{version_pk}/pages/ | 
[**documentsVersionsPagesOcrRead()**](DocumentsApi.md#documentsVersionsPagesOcrRead) | **GET** /documents/{document_pk}/versions/{version_pk}/pages/{page_pk}/ocr/ | 
[**documentsVersionsPagesPartialUpdate()**](DocumentsApi.md#documentsVersionsPagesPartialUpdate) | **PATCH** /documents/{id}/versions/{version_pk}/pages/{page_pk} | 
[**documentsVersionsPagesRead()**](DocumentsApi.md#documentsVersionsPagesRead) | **GET** /documents/{id}/versions/{version_pk}/pages/{page_pk} | 
[**documentsVersionsPagesUpdate()**](DocumentsApi.md#documentsVersionsPagesUpdate) | **PUT** /documents/{id}/versions/{version_pk}/pages/{page_pk} | 
[**documentsVersionsPartialUpdate()**](DocumentsApi.md#documentsVersionsPartialUpdate) | **PATCH** /documents/{id}/versions/{version_pk}/ | 
[**documentsVersionsRead()**](DocumentsApi.md#documentsVersionsRead) | **GET** /documents/{id}/versions/{version_pk}/ | 
[**documentsVersionsSignaturesDetachedCreate()**](DocumentsApi.md#documentsVersionsSignaturesDetachedCreate) | **POST** /documents/{document_id}/versions/{document_version_id}/signatures/detached/ | 
[**documentsVersionsSignaturesDetachedDelete()**](DocumentsApi.md#documentsVersionsSignaturesDetachedDelete) | **DELETE** /documents/{document_id}/versions/{document_version_id}/signatures/detached/{detached_signature_id}/ | 
[**documentsVersionsSignaturesDetachedList()**](DocumentsApi.md#documentsVersionsSignaturesDetachedList) | **GET** /documents/{document_id}/versions/{document_version_id}/signatures/detached/ | 
[**documentsVersionsSignaturesDetachedRead()**](DocumentsApi.md#documentsVersionsSignaturesDetachedRead) | **GET** /documents/{document_id}/versions/{document_version_id}/signatures/detached/{detached_signature_id}/ | 
[**documentsVersionsSignaturesDetachedSignCreate()**](DocumentsApi.md#documentsVersionsSignaturesDetachedSignCreate) | **POST** /documents/{document_id}/versions/{document_version_id}/signatures/detached/sign/ | 
[**documentsVersionsSignaturesEmbeddedList()**](DocumentsApi.md#documentsVersionsSignaturesEmbeddedList) | **GET** /documents/{document_id}/versions/{document_version_id}/signatures/embedded/ | 
[**documentsVersionsSignaturesEmbeddedRead()**](DocumentsApi.md#documentsVersionsSignaturesEmbeddedRead) | **GET** /documents/{document_id}/versions/{document_version_id}/signatures/embedded/{embedded_signature_id}/ | 
[**documentsVersionsSignaturesEmbeddedSignCreate()**](DocumentsApi.md#documentsVersionsSignaturesEmbeddedSignCreate) | **POST** /documents/{document_id}/versions/{document_version_id}/signatures/embedded/sign/ | 
[**documentsVersionsUpdate()**](DocumentsApi.md#documentsVersionsUpdate) | **PUT** /documents/{id}/versions/{version_pk}/ | 
[**documentsWorkflowsList()**](DocumentsApi.md#documentsWorkflowsList) | **GET** /documents/{id}/workflows/ | 
[**documentsWorkflowsLogEntriesCreate()**](DocumentsApi.md#documentsWorkflowsLogEntriesCreate) | **POST** /documents/{id}/workflows/{workflow_pk}/log_entries/ | 
[**documentsWorkflowsLogEntriesList()**](DocumentsApi.md#documentsWorkflowsLogEntriesList) | **GET** /documents/{id}/workflows/{workflow_pk}/log_entries/ | 
[**documentsWorkflowsRead()**](DocumentsApi.md#documentsWorkflowsRead) | **GET** /documents/{id}/workflows/{workflow_pk}/ | 


## `documentsCabinetsList()`

```php
documentsCabinetsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse200
```



Returns a list of all the cabinets to which a document belongs.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsCabinetsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsCabinetsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
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

## `documentsCommentsCreate()`

```php
documentsCommentsCreate($document_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WritableComment
```



Create a new document comment.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableComment(); // \app\App\Edms\OpenAPI\Client\Models\WritableComment

try {
    $result = $apiInstance->documentsCommentsCreate($document_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsCommentsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableComment**](../Model/WritableComment.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableComment**](../Model/WritableComment.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsCommentsDelete()`

```php
documentsCommentsDelete($comment_pk, $document_pk)
```



Delete the selected document comment.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$comment_pk = 'comment_pk_example'; // string
$document_pk = 'document_pk_example'; // string

try {
    $apiInstance->documentsCommentsDelete($comment_pk, $document_pk);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsCommentsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **comment_pk** | **string**|  |
 **document_pk** | **string**|  |

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

## `documentsCommentsList()`

```php
documentsCommentsList($document_pk, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20012
```



Returns a list of all the document comments.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsCommentsList($document_pk, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsCommentsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20012**](../Model/InlineResponse20012.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsCommentsPartialUpdate()`

```php
documentsCommentsPartialUpdate($comment_pk, $document_pk, $data): \app\App\Edms\OpenAPI\Client\Models\Comment
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$comment_pk = 'comment_pk_example'; // string
$document_pk = 'document_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\Comment(); // \app\App\Edms\OpenAPI\Client\Models\Comment

try {
    $result = $apiInstance->documentsCommentsPartialUpdate($comment_pk, $document_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsCommentsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **comment_pk** | **string**|  |
 **document_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\Comment**](../Model/Comment.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Comment**](../Model/Comment.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsCommentsRead()`

```php
documentsCommentsRead($comment_pk, $document_pk): \app\App\Edms\OpenAPI\Client\Models\Comment
```



Returns the details of the selected document comment.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$comment_pk = 'comment_pk_example'; // string
$document_pk = 'document_pk_example'; // string

try {
    $result = $apiInstance->documentsCommentsRead($comment_pk, $document_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsCommentsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **comment_pk** | **string**|  |
 **document_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Comment**](../Model/Comment.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsCommentsUpdate()`

```php
documentsCommentsUpdate($comment_pk, $document_pk, $data): \app\App\Edms\OpenAPI\Client\Models\Comment
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$comment_pk = 'comment_pk_example'; // string
$document_pk = 'document_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\Comment(); // \app\App\Edms\OpenAPI\Client\Models\Comment

try {
    $result = $apiInstance->documentsCommentsUpdate($comment_pk, $document_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsCommentsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **comment_pk** | **string**|  |
 **document_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\Comment**](../Model/Comment.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Comment**](../Model/Comment.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsCreate()`

```php
documentsCreate($data): \app\App\Edms\OpenAPI\Client\Models\NewDocument
```



Create a new document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\NewDocument(); // \app\App\Edms\OpenAPI\Client\Models\NewDocument

try {
    $result = $apiInstance->documentsCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\NewDocument**](../Model/NewDocument.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\NewDocument**](../Model/NewDocument.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsDelete()`

```php
documentsDelete($id)
```



Move the selected document to the thrash.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document.

try {
    $apiInstance->documentsDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document. |

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

## `documentsDownloadRead()`

```php
documentsDownloadRead($id)
```



Download the latest version of a document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document.

try {
    $apiInstance->documentsDownloadRead($id);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsDownloadRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document. |

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

## `documentsIndexesList()`

```php
documentsIndexesList($document_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2009
```



Returns a list of all the indexes instance nodes where this document is found.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsIndexesList($document_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsIndexesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **string**|  |
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

## `documentsList()`

```php
documentsList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2006
```



Returns a list of all the documents.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
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

## `documentsMetadataCreate()`

```php
documentsMetadataCreate($document_pk, $data): \app\App\Edms\OpenAPI\Client\Models\NewDocumentMetadata
```



Add an existing metadata type and value to the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\NewDocumentMetadata(); // \app\App\Edms\OpenAPI\Client\Models\NewDocumentMetadata

try {
    $result = $apiInstance->documentsMetadataCreate($document_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsMetadataCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\NewDocumentMetadata**](../Model/NewDocumentMetadata.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\NewDocumentMetadata**](../Model/NewDocumentMetadata.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsMetadataDelete()`

```php
documentsMetadataDelete($document_pk, $metadata_pk)
```



Remove this metadata entry from the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$metadata_pk = 'metadata_pk_example'; // string

try {
    $apiInstance->documentsMetadataDelete($document_pk, $metadata_pk);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsMetadataDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **metadata_pk** | **string**|  |

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

## `documentsMetadataList()`

```php
documentsMetadataList($document_pk, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20013
```



Returns a list of selected document's metadata types and values.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsMetadataList($document_pk, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsMetadataList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20013**](../Model/InlineResponse20013.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsMetadataPartialUpdate()`

```php
documentsMetadataPartialUpdate($document_pk, $metadata_pk, $data): \app\App\Edms\OpenAPI\Client\Models\DocumentMetadata
```



Edit the selected document metadata type and value.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$metadata_pk = 'metadata_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\DocumentMetadata(); // \app\App\Edms\OpenAPI\Client\Models\DocumentMetadata

try {
    $result = $apiInstance->documentsMetadataPartialUpdate($document_pk, $metadata_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsMetadataPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **metadata_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentMetadata**](../Model/DocumentMetadata.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentMetadata**](../Model/DocumentMetadata.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsMetadataRead()`

```php
documentsMetadataRead($document_pk, $metadata_pk): \app\App\Edms\OpenAPI\Client\Models\DocumentMetadata
```



Return the details of the selected document metadata type and value.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$metadata_pk = 'metadata_pk_example'; // string

try {
    $result = $apiInstance->documentsMetadataRead($document_pk, $metadata_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsMetadataRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **metadata_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentMetadata**](../Model/DocumentMetadata.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsMetadataUpdate()`

```php
documentsMetadataUpdate($document_pk, $metadata_pk, $data): \app\App\Edms\OpenAPI\Client\Models\DocumentMetadata
```



Edit the selected document metadata type and value.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$metadata_pk = 'metadata_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\DocumentMetadata(); // \app\App\Edms\OpenAPI\Client\Models\DocumentMetadata

try {
    $result = $apiInstance->documentsMetadataUpdate($document_pk, $metadata_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsMetadataUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **metadata_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentMetadata**](../Model/DocumentMetadata.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentMetadata**](../Model/DocumentMetadata.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsOcrSubmitCreate()`

```php
documentsOcrSubmitCreate($id)
```



Submit a document for OCR.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document.

try {
    $apiInstance->documentsOcrSubmitCreate($id);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsOcrSubmitCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document. |

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

## `documentsPartialUpdate()`

```php
documentsPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableDocument
```



Edit the properties of the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocument(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocument

try {
    $result = $apiInstance->documentsPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocument**](../Model/WritableDocument.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocument**](../Model/WritableDocument.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsRead()`

```php
documentsRead($id): \app\App\Edms\OpenAPI\Client\Models\Document
```



Return the details of the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document.

try {
    $result = $apiInstance->documentsRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Document**](../Model/Document.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsRecentList()`

```php
documentsRecentList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2008
```



Return a list of the recent documents for the current user.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsRecentList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsRecentList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse2008**](../Model/InlineResponse2008.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsResolvedSmartLinksDocumentsList()`

```php
documentsResolvedSmartLinksDocumentsList($id, $smart_link_pk, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20016
```



Returns a list of the smart link documents that apply to the document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$smart_link_pk = 'smart_link_pk_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsResolvedSmartLinksDocumentsList($id, $smart_link_pk, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsResolvedSmartLinksDocumentsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **smart_link_pk** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20016**](../Model/InlineResponse20016.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsResolvedSmartLinksList()`

```php
documentsResolvedSmartLinksList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20015
```



Returns a list of the smart links that apply to the document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsResolvedSmartLinksList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsResolvedSmartLinksList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20015**](../Model/InlineResponse20015.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsResolvedSmartLinksRead()`

```php
documentsResolvedSmartLinksRead($id, $smart_link_pk): \app\App\Edms\OpenAPI\Client\Models\ResolvedSmartLink
```



Return the details of the selected resolved smart link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$smart_link_pk = 'smart_link_pk_example'; // string

try {
    $result = $apiInstance->documentsResolvedSmartLinksRead($id, $smart_link_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsResolvedSmartLinksRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **smart_link_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\ResolvedSmartLink**](../Model/ResolvedSmartLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsResolvedWebLinksList()`

```php
documentsResolvedWebLinksList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20017
```



Returns a list of resolved web links for the specified document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsResolvedWebLinksList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsResolvedWebLinksList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20017**](../Model/InlineResponse20017.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsResolvedWebLinksNavigateRead()`

```php
documentsResolvedWebLinksNavigateRead($id, $resolved_web_link_pk)
```



Perform a redirection to the target URL of the selected resolved smart link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$resolved_web_link_pk = 'resolved_web_link_pk_example'; // string

try {
    $apiInstance->documentsResolvedWebLinksNavigateRead($id, $resolved_web_link_pk);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsResolvedWebLinksNavigateRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **resolved_web_link_pk** | **string**|  |

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

## `documentsResolvedWebLinksRead()`

```php
documentsResolvedWebLinksRead($id, $resolved_web_link_pk): \app\App\Edms\OpenAPI\Client\Models\ResolvedWebLink
```



Return the details of the selected resolved smart link.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$resolved_web_link_pk = 'resolved_web_link_pk_example'; // string

try {
    $result = $apiInstance->documentsResolvedWebLinksRead($id, $resolved_web_link_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsResolvedWebLinksRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **resolved_web_link_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\ResolvedWebLink**](../Model/ResolvedWebLink.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsTagsCreate()`

```php
documentsTagsCreate($document_pk, $data): \app\App\Edms\OpenAPI\Client\Models\NewDocumentTag
```



Attach a tag to a document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\NewDocumentTag(); // \app\App\Edms\OpenAPI\Client\Models\NewDocumentTag

try {
    $result = $apiInstance->documentsTagsCreate($document_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsTagsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\NewDocumentTag**](../Model/NewDocumentTag.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\NewDocumentTag**](../Model/NewDocumentTag.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsTagsDelete()`

```php
documentsTagsDelete($document_pk, $id)
```



Remove a tag from the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$id = 'id_example'; // string

try {
    $apiInstance->documentsTagsDelete($document_pk, $id);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsTagsDelete: ', $e->getMessage(), PHP_EOL;
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

## `documentsTagsList()`

```php
documentsTagsList($document_pk, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20014
```



Returns a list of all the tags attached to a document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsTagsList($document_pk, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsTagsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20014**](../Model/InlineResponse20014.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsTagsRead()`

```php
documentsTagsRead($document_pk, $id): \app\App\Edms\OpenAPI\Client\Models\DocumentTag
```



Returns the details of the selected document tag.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$id = 'id_example'; // string

try {
    $result = $apiInstance->documentsTagsRead($document_pk, $id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsTagsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentTag**](../Model/DocumentTag.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsTypeChangeCreate()`

```php
documentsTypeChangeCreate($id, $data): \app\App\Edms\OpenAPI\Client\Models\NewDocumentDocumentType
```



Change the type of the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document.
$data = new \app\App\Edms\OpenAPI\Client\Models\NewDocumentDocumentType(); // \app\App\Edms\OpenAPI\Client\Models\NewDocumentDocumentType

try {
    $result = $apiInstance->documentsTypeChangeCreate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsTypeChangeCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\NewDocumentDocumentType**](../Model/NewDocumentDocumentType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\NewDocumentDocumentType**](../Model/NewDocumentDocumentType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsUpdate()`

```php
documentsUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableDocument
```



Edit the properties of the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Document.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocument(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocument

try {
    $result = $apiInstance->documentsUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Document. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocument**](../Model/WritableDocument.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocument**](../Model/WritableDocument.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsCreate()`

```php
documentsVersionsCreate($id, $data): \app\App\Edms\OpenAPI\Client\Models\NewDocumentVersion
```



Create a new document version.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\NewDocumentVersion(); // \app\App\Edms\OpenAPI\Client\Models\NewDocumentVersion

try {
    $result = $apiInstance->documentsVersionsCreate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\NewDocumentVersion**](../Model/NewDocumentVersion.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\NewDocumentVersion**](../Model/NewDocumentVersion.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsDelete()`

```php
documentsVersionsDelete($id, $version_pk)
```



Delete the selected document version.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$version_pk = 'version_pk_example'; // string

try {
    $apiInstance->documentsVersionsDelete($id, $version_pk);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **version_pk** | **string**|  |

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

## `documentsVersionsDownloadRead()`

```php
documentsVersionsDownloadRead($id, $version_pk)
```



Download a document version.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$version_pk = 'version_pk_example'; // string

try {
    $apiInstance->documentsVersionsDownloadRead($id, $version_pk);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsDownloadRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **version_pk** | **string**|  |

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

## `documentsVersionsList()`

```php
documentsVersionsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20018
```



Return a list of the selected document's versions.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsVersionsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20018**](../Model/InlineResponse20018.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsOcrCreate()`

```php
documentsVersionsOcrCreate($document_pk, $version_pk)
```



Submit a document version for OCR.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$version_pk = 'version_pk_example'; // string

try {
    $apiInstance->documentsVersionsOcrCreate($document_pk, $version_pk);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsOcrCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **version_pk** | **string**|  |

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

## `documentsVersionsPagesContentRead()`

```php
documentsVersionsPagesContentRead($document_pk, $page_pk, $version_pk): \app\App\Edms\OpenAPI\Client\Models\DocumentPageContent
```



Returns the content of the selected document page.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$page_pk = 'page_pk_example'; // string
$version_pk = 'version_pk_example'; // string

try {
    $result = $apiInstance->documentsVersionsPagesContentRead($document_pk, $page_pk, $version_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsPagesContentRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **page_pk** | **string**|  |
 **version_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentPageContent**](../Model/DocumentPageContent.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsPagesImageRead()`

```php
documentsVersionsPagesImageRead($id, $page_pk, $version_pk)
```



Returns an image representation of the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page_pk = 'page_pk_example'; // string
$version_pk = 'version_pk_example'; // string

try {
    $apiInstance->documentsVersionsPagesImageRead($id, $page_pk, $version_pk);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsPagesImageRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page_pk** | **string**|  |
 **version_pk** | **string**|  |

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

## `documentsVersionsPagesList()`

```php
documentsVersionsPagesList($id, $version_pk, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20019
```



### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$version_pk = 'version_pk_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsVersionsPagesList($id, $version_pk, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsPagesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **version_pk** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20019**](../Model/InlineResponse20019.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsPagesOcrRead()`

```php
documentsVersionsPagesOcrRead($document_pk, $page_pk, $version_pk): \app\App\Edms\OpenAPI\Client\Models\DocumentPageOCRContent
```



Returns the OCR content of the selected document page.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_pk = 'document_pk_example'; // string
$page_pk = 'page_pk_example'; // string
$version_pk = 'version_pk_example'; // string

try {
    $result = $apiInstance->documentsVersionsPagesOcrRead($document_pk, $page_pk, $version_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsPagesOcrRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_pk** | **string**|  |
 **page_pk** | **string**|  |
 **version_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentPageOCRContent**](../Model/DocumentPageOCRContent.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsPagesPartialUpdate()`

```php
documentsVersionsPagesPartialUpdate($id, $page_pk, $version_pk, $data): \app\App\Edms\OpenAPI\Client\Models\DocumentPage
```



Edit the selected document page.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page_pk = 'page_pk_example'; // string
$version_pk = 'version_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\DocumentPage(); // \app\App\Edms\OpenAPI\Client\Models\DocumentPage

try {
    $result = $apiInstance->documentsVersionsPagesPartialUpdate($id, $page_pk, $version_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsPagesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page_pk** | **string**|  |
 **version_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentPage**](../Model/DocumentPage.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentPage**](../Model/DocumentPage.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsPagesRead()`

```php
documentsVersionsPagesRead($id, $page_pk, $version_pk): \app\App\Edms\OpenAPI\Client\Models\DocumentPage
```



Returns the selected document page details.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page_pk = 'page_pk_example'; // string
$version_pk = 'version_pk_example'; // string

try {
    $result = $apiInstance->documentsVersionsPagesRead($id, $page_pk, $version_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsPagesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page_pk** | **string**|  |
 **version_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentPage**](../Model/DocumentPage.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsPagesUpdate()`

```php
documentsVersionsPagesUpdate($id, $page_pk, $version_pk, $data): \app\App\Edms\OpenAPI\Client\Models\DocumentPage
```



Edit the selected document page.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page_pk = 'page_pk_example'; // string
$version_pk = 'version_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\DocumentPage(); // \app\App\Edms\OpenAPI\Client\Models\DocumentPage

try {
    $result = $apiInstance->documentsVersionsPagesUpdate($id, $page_pk, $version_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsPagesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page_pk** | **string**|  |
 **version_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DocumentPage**](../Model/DocumentPage.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentPage**](../Model/DocumentPage.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsPartialUpdate()`

```php
documentsVersionsPartialUpdate($id, $version_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion
```



Edit the selected document version.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$version_pk = 'version_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion

try {
    $result = $apiInstance->documentsVersionsPartialUpdate($id, $version_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **version_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion**](../Model/WritableDocumentVersion.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion**](../Model/WritableDocumentVersion.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsRead()`

```php
documentsVersionsRead($id, $version_pk): \app\App\Edms\OpenAPI\Client\Models\DocumentVersion
```



Returns the selected document version details.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$version_pk = 'version_pk_example'; // string

try {
    $result = $apiInstance->documentsVersionsRead($id, $version_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **version_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DocumentVersion**](../Model/DocumentVersion.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsSignaturesDetachedCreate()`

```php
documentsVersionsSignaturesDetachedCreate($document_id, $document_version_id, $data): \app\App\Edms\OpenAPI\Client\Models\DetachedSignature
```



Create a detached signature for a document version.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string
$document_version_id = 'document_version_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\DetachedSignature(); // \app\App\Edms\OpenAPI\Client\Models\DetachedSignature

try {
    $result = $apiInstance->documentsVersionsSignaturesDetachedCreate($document_id, $document_version_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsSignaturesDetachedCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **string**|  |
 **document_version_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\DetachedSignature**](../Model/DetachedSignature.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DetachedSignature**](../Model/DetachedSignature.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsSignaturesDetachedDelete()`

```php
documentsVersionsSignaturesDetachedDelete($detached_signature_id, $document_id, $document_version_id)
```



Delete an detached signature of the selected document.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$detached_signature_id = 'detached_signature_id_example'; // string
$document_id = 'document_id_example'; // string
$document_version_id = 'document_version_id_example'; // string

try {
    $apiInstance->documentsVersionsSignaturesDetachedDelete($detached_signature_id, $document_id, $document_version_id);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsSignaturesDetachedDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **detached_signature_id** | **string**|  |
 **document_id** | **string**|  |
 **document_version_id** | **string**|  |

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

## `documentsVersionsSignaturesDetachedList()`

```php
documentsVersionsSignaturesDetachedList($document_id, $document_version_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20010
```



Returns a list of all the detached signatures of a document version.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string
$document_version_id = 'document_version_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsVersionsSignaturesDetachedList($document_id, $document_version_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsSignaturesDetachedList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **string**|  |
 **document_version_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20010**](../Model/InlineResponse20010.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsSignaturesDetachedRead()`

```php
documentsVersionsSignaturesDetachedRead($detached_signature_id, $document_id, $document_version_id): \app\App\Edms\OpenAPI\Client\Models\DetachedSignature
```



Returns the details of the selected detached signature.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$detached_signature_id = 'detached_signature_id_example'; // string
$document_id = 'document_id_example'; // string
$document_version_id = 'document_version_id_example'; // string

try {
    $result = $apiInstance->documentsVersionsSignaturesDetachedRead($detached_signature_id, $document_id, $document_version_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsSignaturesDetachedRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **detached_signature_id** | **string**|  |
 **document_id** | **string**|  |
 **document_version_id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\DetachedSignature**](../Model/DetachedSignature.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsSignaturesDetachedSignCreate()`

```php
documentsVersionsSignaturesDetachedSignCreate($document_id, $document_version_id, $data): \app\App\Edms\OpenAPI\Client\Models\SignDetached
```



Sign a document version with a detached signature.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string
$document_version_id = 'document_version_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\SignDetached(); // \app\App\Edms\OpenAPI\Client\Models\SignDetached

try {
    $result = $apiInstance->documentsVersionsSignaturesDetachedSignCreate($document_id, $document_version_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsSignaturesDetachedSignCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **string**|  |
 **document_version_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\SignDetached**](../Model/SignDetached.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\SignDetached**](../Model/SignDetached.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsSignaturesEmbeddedList()`

```php
documentsVersionsSignaturesEmbeddedList($document_id, $document_version_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20011
```



Returns a list of all the embedded signatures of a document version.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string
$document_version_id = 'document_version_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsVersionsSignaturesEmbeddedList($document_id, $document_version_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsSignaturesEmbeddedList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **string**|  |
 **document_version_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20011**](../Model/InlineResponse20011.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsSignaturesEmbeddedRead()`

```php
documentsVersionsSignaturesEmbeddedRead($document_id, $document_version_id, $embedded_signature_id): \app\App\Edms\OpenAPI\Client\Models\EmbeddedSignature
```



Returns the details of the selected embedded signature.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string
$document_version_id = 'document_version_id_example'; // string
$embedded_signature_id = 'embedded_signature_id_example'; // string

try {
    $result = $apiInstance->documentsVersionsSignaturesEmbeddedRead($document_id, $document_version_id, $embedded_signature_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsSignaturesEmbeddedRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **string**|  |
 **document_version_id** | **string**|  |
 **embedded_signature_id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\EmbeddedSignature**](../Model/EmbeddedSignature.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsSignaturesEmbeddedSignCreate()`

```php
documentsVersionsSignaturesEmbeddedSignCreate($document_id, $document_version_id, $data): \app\App\Edms\OpenAPI\Client\Models\SignEmbedded
```



Sign a document version with an embedded signature.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_id = 'document_id_example'; // string
$document_version_id = 'document_version_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\SignEmbedded(); // \app\App\Edms\OpenAPI\Client\Models\SignEmbedded

try {
    $result = $apiInstance->documentsVersionsSignaturesEmbeddedSignCreate($document_id, $document_version_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsSignaturesEmbeddedSignCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_id** | **string**|  |
 **document_version_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\SignEmbedded**](../Model/SignEmbedded.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\SignEmbedded**](../Model/SignEmbedded.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsVersionsUpdate()`

```php
documentsVersionsUpdate($id, $version_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion
```



Edit the selected document version.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$version_pk = 'version_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion(); // \app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion

try {
    $result = $apiInstance->documentsVersionsUpdate($id, $version_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsVersionsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **version_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion**](../Model/WritableDocumentVersion.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableDocumentVersion**](../Model/WritableDocumentVersion.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsWorkflowsList()`

```php
documentsWorkflowsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20020
```



Returns a list of all the document workflows.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsWorkflowsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsWorkflowsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20020**](../Model/InlineResponse20020.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsWorkflowsLogEntriesCreate()`

```php
documentsWorkflowsLogEntriesCreate($id, $workflow_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowInstanceLogEntry
```



Transition a document workflow by creating a new document workflow log entry.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_pk = 'workflow_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowInstanceLogEntry(); // \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowInstanceLogEntry

try {
    $result = $apiInstance->documentsWorkflowsLogEntriesCreate($id, $workflow_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsWorkflowsLogEntriesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflowInstanceLogEntry**](../Model/WritableWorkflowInstanceLogEntry.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflowInstanceLogEntry**](../Model/WritableWorkflowInstanceLogEntry.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsWorkflowsLogEntriesList()`

```php
documentsWorkflowsLogEntriesList($id, $workflow_pk, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20021
```



Returns a list of all the document workflows log entries.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_pk = 'workflow_pk_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->documentsWorkflowsLogEntriesList($id, $workflow_pk, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsWorkflowsLogEntriesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_pk** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20021**](../Model/InlineResponse20021.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `documentsWorkflowsRead()`

```php
documentsWorkflowsRead($id, $workflow_pk): \app\App\Edms\OpenAPI\Client\Models\WorkflowInstance
```



Return the details of the selected document workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiDocumentsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_pk = 'workflow_pk_example'; // string

try {
    $result = $apiInstance->documentsWorkflowsRead($id, $workflow_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling DocumentsApi->documentsWorkflowsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowInstance**](../Model/WorkflowInstance.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
