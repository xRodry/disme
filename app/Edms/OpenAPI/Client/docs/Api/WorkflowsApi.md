# OpenAPI\Client\WorkflowsApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**workflowsCreate()**](WorkflowsApi.md#workflowsCreate) | **POST** /workflows/ | 
[**workflowsDelete()**](WorkflowsApi.md#workflowsDelete) | **DELETE** /workflows/{id}/ | 
[**workflowsDocumentTypesCreate()**](WorkflowsApi.md#workflowsDocumentTypesCreate) | **POST** /workflows/{id}/document_types/ | 
[**workflowsDocumentTypesDelete()**](WorkflowsApi.md#workflowsDocumentTypesDelete) | **DELETE** /workflows/{id}/document_types/{document_type_pk}/ | 
[**workflowsDocumentTypesList()**](WorkflowsApi.md#workflowsDocumentTypesList) | **GET** /workflows/{id}/document_types/ | 
[**workflowsDocumentTypesRead()**](WorkflowsApi.md#workflowsDocumentTypesRead) | **GET** /workflows/{id}/document_types/{document_type_pk}/ | 
[**workflowsImageRead()**](WorkflowsApi.md#workflowsImageRead) | **GET** /workflows/{id}/image/ | 
[**workflowsList()**](WorkflowsApi.md#workflowsList) | **GET** /workflows/ | 
[**workflowsPartialUpdate()**](WorkflowsApi.md#workflowsPartialUpdate) | **PATCH** /workflows/{id}/ | 
[**workflowsRead()**](WorkflowsApi.md#workflowsRead) | **GET** /workflows/{id}/ | 
[**workflowsStatesCreate()**](WorkflowsApi.md#workflowsStatesCreate) | **POST** /workflows/{id}/states/ | 
[**workflowsStatesDelete()**](WorkflowsApi.md#workflowsStatesDelete) | **DELETE** /workflows/{id}/states/{state_pk}/ | 
[**workflowsStatesList()**](WorkflowsApi.md#workflowsStatesList) | **GET** /workflows/{id}/states/ | 
[**workflowsStatesPartialUpdate()**](WorkflowsApi.md#workflowsStatesPartialUpdate) | **PATCH** /workflows/{id}/states/{state_pk}/ | 
[**workflowsStatesRead()**](WorkflowsApi.md#workflowsStatesRead) | **GET** /workflows/{id}/states/{state_pk}/ | 
[**workflowsStatesUpdate()**](WorkflowsApi.md#workflowsStatesUpdate) | **PUT** /workflows/{id}/states/{state_pk}/ | 
[**workflowsTransitionsCreate()**](WorkflowsApi.md#workflowsTransitionsCreate) | **POST** /workflows/{id}/transitions/ | 
[**workflowsTransitionsDelete()**](WorkflowsApi.md#workflowsTransitionsDelete) | **DELETE** /workflows/{id}/transitions/{transition_pk}/ | 
[**workflowsTransitionsFieldsCreate()**](WorkflowsApi.md#workflowsTransitionsFieldsCreate) | **POST** /workflows/{id}/transitions/{workflow_transition_id}/fields/ | 
[**workflowsTransitionsFieldsDelete()**](WorkflowsApi.md#workflowsTransitionsFieldsDelete) | **DELETE** /workflows/{id}/transitions/{workflow_transition_id}/fields/{workflow_transition_field_id} | 
[**workflowsTransitionsFieldsList()**](WorkflowsApi.md#workflowsTransitionsFieldsList) | **GET** /workflows/{id}/transitions/{workflow_transition_id}/fields/ | 
[**workflowsTransitionsFieldsPartialUpdate()**](WorkflowsApi.md#workflowsTransitionsFieldsPartialUpdate) | **PATCH** /workflows/{id}/transitions/{workflow_transition_id}/fields/{workflow_transition_field_id} | 
[**workflowsTransitionsFieldsRead()**](WorkflowsApi.md#workflowsTransitionsFieldsRead) | **GET** /workflows/{id}/transitions/{workflow_transition_id}/fields/{workflow_transition_field_id} | 
[**workflowsTransitionsFieldsUpdate()**](WorkflowsApi.md#workflowsTransitionsFieldsUpdate) | **PUT** /workflows/{id}/transitions/{workflow_transition_id}/fields/{workflow_transition_field_id} | 
[**workflowsTransitionsList()**](WorkflowsApi.md#workflowsTransitionsList) | **GET** /workflows/{id}/transitions/ | 
[**workflowsTransitionsPartialUpdate()**](WorkflowsApi.md#workflowsTransitionsPartialUpdate) | **PATCH** /workflows/{id}/transitions/{transition_pk}/ | 
[**workflowsTransitionsRead()**](WorkflowsApi.md#workflowsTransitionsRead) | **GET** /workflows/{id}/transitions/{transition_pk}/ | 
[**workflowsTransitionsUpdate()**](WorkflowsApi.md#workflowsTransitionsUpdate) | **PUT** /workflows/{id}/transitions/{transition_pk}/ | 
[**workflowsUpdate()**](WorkflowsApi.md#workflowsUpdate) | **PUT** /workflows/{id}/ | 


## `workflowsCreate()`

```php
workflowsCreate($data): \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow
```



Create a new workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow(); // \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow

try {
    $result = $apiInstance->workflowsCreate($data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflow**](../Model/WritableWorkflow.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflow**](../Model/WritableWorkflow.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsDelete()`

```php
workflowsDelete($id)
```



Delete the selected workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Workflow.

try {
    $apiInstance->workflowsDelete($id);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Workflow. |

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

## `workflowsDocumentTypesCreate()`

```php
workflowsDocumentTypesCreate($id, $data): \app\App\Edms\OpenAPI\Client\Models\NewWorkflowDocumentType
```



Attach a document type to a specified workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\NewWorkflowDocumentType(); // \app\App\Edms\OpenAPI\Client\Models\NewWorkflowDocumentType

try {
    $result = $apiInstance->workflowsDocumentTypesCreate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsDocumentTypesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\NewWorkflowDocumentType**](../Model/NewWorkflowDocumentType.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\NewWorkflowDocumentType**](../Model/NewWorkflowDocumentType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsDocumentTypesDelete()`

```php
workflowsDocumentTypesDelete($document_type_pk, $id)
```



Remove a document type from the selected workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_type_pk = 'document_type_pk_example'; // string
$id = 'id_example'; // string

try {
    $apiInstance->workflowsDocumentTypesDelete($document_type_pk, $id);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsDocumentTypesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_type_pk** | **string**|  |
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

## `workflowsDocumentTypesList()`

```php
workflowsDocumentTypesList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20046
```



Returns a list of all the document types attached to a workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->workflowsDocumentTypesList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsDocumentTypesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20046**](../Model/InlineResponse20046.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsDocumentTypesRead()`

```php
workflowsDocumentTypesRead($document_type_pk, $id): \app\App\Edms\OpenAPI\Client\Models\WorkflowDocumentType
```



Returns the details of the selected workflow document type.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$document_type_pk = 'document_type_pk_example'; // string
$id = 'id_example'; // string

try {
    $result = $apiInstance->workflowsDocumentTypesRead($document_type_pk, $id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsDocumentTypesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **document_type_pk** | **string**|  |
 **id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowDocumentType**](../Model/WorkflowDocumentType.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsImageRead()`

```php
workflowsImageRead($id)
```



Returns an image representation of the selected workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Workflow.

try {
    $apiInstance->workflowsImageRead($id);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsImageRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Workflow. |

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

## `workflowsList()`

```php
workflowsList($page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse2007
```



Returns a list of all the workflows.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->workflowsList($page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
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

## `workflowsPartialUpdate()`

```php
workflowsPartialUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow
```



Edit the selected workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Workflow.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow(); // \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow

try {
    $result = $apiInstance->workflowsPartialUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Workflow. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflow**](../Model/WritableWorkflow.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflow**](../Model/WritableWorkflow.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsRead()`

```php
workflowsRead($id): \app\App\Edms\OpenAPI\Client\Models\Workflow
```



Return the details of the selected workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Workflow.

try {
    $result = $apiInstance->workflowsRead($id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Workflow. |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\Workflow**](../Model/Workflow.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsStatesCreate()`

```php
workflowsStatesCreate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WorkflowState
```



Create a new workflow state.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WorkflowState(); // \app\App\Edms\OpenAPI\Client\Models\WorkflowState

try {
    $result = $apiInstance->workflowsStatesCreate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsStatesCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowState**](../Model/WorkflowState.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowState**](../Model/WorkflowState.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsStatesDelete()`

```php
workflowsStatesDelete($id, $state_pk)
```



Delete the selected workflow state.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$state_pk = 'state_pk_example'; // string

try {
    $apiInstance->workflowsStatesDelete($id, $state_pk);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsStatesDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **state_pk** | **string**|  |

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

## `workflowsStatesList()`

```php
workflowsStatesList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20047
```



Returns a list of all the workflow states.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->workflowsStatesList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsStatesList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20047**](../Model/InlineResponse20047.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsStatesPartialUpdate()`

```php
workflowsStatesPartialUpdate($id, $state_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WorkflowState
```



Edit the selected workflow state.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$state_pk = 'state_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WorkflowState(); // \app\App\Edms\OpenAPI\Client\Models\WorkflowState

try {
    $result = $apiInstance->workflowsStatesPartialUpdate($id, $state_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsStatesPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **state_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowState**](../Model/WorkflowState.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowState**](../Model/WorkflowState.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsStatesRead()`

```php
workflowsStatesRead($id, $state_pk): \app\App\Edms\OpenAPI\Client\Models\WorkflowState
```



Return the details of the selected workflow state.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$state_pk = 'state_pk_example'; // string

try {
    $result = $apiInstance->workflowsStatesRead($id, $state_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsStatesRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **state_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowState**](../Model/WorkflowState.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsStatesUpdate()`

```php
workflowsStatesUpdate($id, $state_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WorkflowState
```



Edit the selected workflow state.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$state_pk = 'state_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WorkflowState(); // \app\App\Edms\OpenAPI\Client\Models\WorkflowState

try {
    $result = $apiInstance->workflowsStatesUpdate($id, $state_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsStatesUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **state_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowState**](../Model/WorkflowState.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowState**](../Model/WorkflowState.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsCreate()`

```php
workflowsTransitionsCreate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition
```



Create a new workflow transition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition(); // \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition

try {
    $result = $apiInstance->workflowsTransitionsCreate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition**](../Model/WritableWorkflowTransition.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition**](../Model/WritableWorkflowTransition.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsDelete()`

```php
workflowsTransitionsDelete($id, $transition_pk)
```



Delete the selected workflow transition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$transition_pk = 'transition_pk_example'; // string

try {
    $apiInstance->workflowsTransitionsDelete($id, $transition_pk);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **transition_pk** | **string**|  |

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

## `workflowsTransitionsFieldsCreate()`

```php
workflowsTransitionsFieldsCreate($id, $workflow_transition_id, $data): \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField
```



Create a new workflow transition field.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_transition_id = 'workflow_transition_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField(); // \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField

try {
    $result = $apiInstance->workflowsTransitionsFieldsCreate($id, $workflow_transition_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsFieldsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_transition_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField**](../Model/WorkflowTransitionField.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField**](../Model/WorkflowTransitionField.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsFieldsDelete()`

```php
workflowsTransitionsFieldsDelete($id, $workflow_transition_field_id, $workflow_transition_id)
```



Delete the selected workflow transition field.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_transition_field_id = 'workflow_transition_field_id_example'; // string
$workflow_transition_id = 'workflow_transition_id_example'; // string

try {
    $apiInstance->workflowsTransitionsFieldsDelete($id, $workflow_transition_field_id, $workflow_transition_id);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsFieldsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_transition_field_id** | **string**|  |
 **workflow_transition_id** | **string**|  |

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

## `workflowsTransitionsFieldsList()`

```php
workflowsTransitionsFieldsList($id, $workflow_transition_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20049
```



Returns a list of all the workflow transition fields.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_transition_id = 'workflow_transition_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->workflowsTransitionsFieldsList($id, $workflow_transition_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsFieldsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_transition_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20049**](../Model/InlineResponse20049.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsFieldsPartialUpdate()`

```php
workflowsTransitionsFieldsPartialUpdate($id, $workflow_transition_field_id, $workflow_transition_id, $data): \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField
```



Edit the selected workflow transition field.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_transition_field_id = 'workflow_transition_field_id_example'; // string
$workflow_transition_id = 'workflow_transition_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField(); // \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField

try {
    $result = $apiInstance->workflowsTransitionsFieldsPartialUpdate($id, $workflow_transition_field_id, $workflow_transition_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsFieldsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_transition_field_id** | **string**|  |
 **workflow_transition_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField**](../Model/WorkflowTransitionField.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField**](../Model/WorkflowTransitionField.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsFieldsRead()`

```php
workflowsTransitionsFieldsRead($id, $workflow_transition_field_id, $workflow_transition_id): \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField
```



Return the details of the selected workflow transition field.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_transition_field_id = 'workflow_transition_field_id_example'; // string
$workflow_transition_id = 'workflow_transition_id_example'; // string

try {
    $result = $apiInstance->workflowsTransitionsFieldsRead($id, $workflow_transition_field_id, $workflow_transition_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsFieldsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_transition_field_id** | **string**|  |
 **workflow_transition_id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField**](../Model/WorkflowTransitionField.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsFieldsUpdate()`

```php
workflowsTransitionsFieldsUpdate($id, $workflow_transition_field_id, $workflow_transition_id, $data): \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField
```



Edit the selected workflow transition field.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$workflow_transition_field_id = 'workflow_transition_field_id_example'; // string
$workflow_transition_id = 'workflow_transition_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField(); // \app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField

try {
    $result = $apiInstance->workflowsTransitionsFieldsUpdate($id, $workflow_transition_field_id, $workflow_transition_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsFieldsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **workflow_transition_field_id** | **string**|  |
 **workflow_transition_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField**](../Model/WorkflowTransitionField.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransitionField**](../Model/WorkflowTransitionField.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsList()`

```php
workflowsTransitionsList($id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20048
```



Returns a list of all the workflow transitions.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->workflowsTransitionsList($id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20048**](../Model/InlineResponse20048.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsPartialUpdate()`

```php
workflowsTransitionsPartialUpdate($id, $transition_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition
```



Edit the selected workflow transition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$transition_pk = 'transition_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition(); // \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition

try {
    $result = $apiInstance->workflowsTransitionsPartialUpdate($id, $transition_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsPartialUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **transition_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition**](../Model/WritableWorkflowTransition.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition**](../Model/WritableWorkflowTransition.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsRead()`

```php
workflowsTransitionsRead($id, $transition_pk): \app\App\Edms\OpenAPI\Client\Models\WorkflowTransition
```



Return the details of the selected workflow transition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$transition_pk = 'transition_pk_example'; // string

try {
    $result = $apiInstance->workflowsTransitionsRead($id, $transition_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **transition_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WorkflowTransition**](../Model/WorkflowTransition.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsTransitionsUpdate()`

```php
workflowsTransitionsUpdate($id, $transition_pk, $data): \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition
```



Edit the selected workflow transition.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 'id_example'; // string
$transition_pk = 'transition_pk_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition(); // \app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition

try {
    $result = $apiInstance->workflowsTransitionsUpdate($id, $transition_pk, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsTransitionsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **string**|  |
 **transition_pk** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition**](../Model/WritableWorkflowTransition.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflowTransition**](../Model/WritableWorkflowTransition.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `workflowsUpdate()`

```php
workflowsUpdate($id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow
```



Edit the selected workflow.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Disme\Support\ExternalIntegrations\OpenAPI\Client\ApiWorkflowsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$id = 56; // int | A unique integer value identifying this Workflow.
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow(); // \app\App\Edms\OpenAPI\Client\Models\WritableWorkflow

try {
    $result = $apiInstance->workflowsUpdate($id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling WorkflowsApi->workflowsUpdate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **int**| A unique integer value identifying this Workflow. |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflow**](../Model/WritableWorkflow.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableWorkflow**](../Model/WritableWorkflow.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
