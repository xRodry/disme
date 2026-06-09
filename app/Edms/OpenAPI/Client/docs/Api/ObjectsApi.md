# OpenAPI\Client\ObjectsApi

All URIs are relative to http://localhost:1234/api.

Method | HTTP request | Description
------------- | ------------- | -------------
[**objectsAclsCreate()**](ObjectsApi.md#objectsAclsCreate) | **POST** /objects/{app_label}/{model_name}/{object_id}/acls/ | 
[**objectsAclsDelete()**](ObjectsApi.md#objectsAclsDelete) | **DELETE** /objects/{app_label}/{model_name}/{object_id}/acls/{id}/ | 
[**objectsAclsList()**](ObjectsApi.md#objectsAclsList) | **GET** /objects/{app_label}/{model_name}/{object_id}/acls/ | 
[**objectsAclsPermissionsCreate()**](ObjectsApi.md#objectsAclsPermissionsCreate) | **POST** /objects/{app_label}/{model_name}/{object_id}/acls/{id}/permissions/ | 
[**objectsAclsPermissionsDelete()**](ObjectsApi.md#objectsAclsPermissionsDelete) | **DELETE** /objects/{app_label}/{model_name}/{object_id}/acls/{id}/permissions/{permission_pk}/ | 
[**objectsAclsPermissionsList()**](ObjectsApi.md#objectsAclsPermissionsList) | **GET** /objects/{app_label}/{model_name}/{object_id}/acls/{id}/permissions/ | 
[**objectsAclsPermissionsRead()**](ObjectsApi.md#objectsAclsPermissionsRead) | **GET** /objects/{app_label}/{model_name}/{object_id}/acls/{id}/permissions/{permission_pk}/ | 
[**objectsAclsRead()**](ObjectsApi.md#objectsAclsRead) | **GET** /objects/{app_label}/{model_name}/{object_id}/acls/{id}/ | 
[**objectsEventsList()**](ObjectsApi.md#objectsEventsList) | **GET** /objects/{app_label}/{model}/{object_id}/events/ | 
[**objectsPermissionsList()**](ObjectsApi.md#objectsPermissionsList) | **GET** /objects/{app_label}/{model_name}/permissions/ | 


## `objectsAclsCreate()`

```php
objectsAclsCreate($app_label, $model_name, $object_id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableAccessControlList
```



Create a new access control list for the selected object.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$model_name = 'model_name_example'; // string
$object_id = 'object_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableAccessControlList(); // \app\App\Edms\OpenAPI\Client\Models\WritableAccessControlList

try {
    $result = $apiInstance->objectsAclsCreate($app_label, $model_name, $object_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsAclsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **model_name** | **string**|  |
 **object_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableAccessControlList**](../Model/WritableAccessControlList.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableAccessControlList**](../Model/WritableAccessControlList.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `objectsAclsDelete()`

```php
objectsAclsDelete($app_label, $id, $model_name, $object_id)
```



Delete the selected access control list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$id = 'id_example'; // string
$model_name = 'model_name_example'; // string
$object_id = 'object_id_example'; // string

try {
    $apiInstance->objectsAclsDelete($app_label, $id, $model_name, $object_id);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsAclsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **id** | **string**|  |
 **model_name** | **string**|  |
 **object_id** | **string**|  |

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

## `objectsAclsList()`

```php
objectsAclsList($app_label, $model_name, $object_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20034
```



Returns a list of all the object's access control lists

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$model_name = 'model_name_example'; // string
$object_id = 'object_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->objectsAclsList($app_label, $model_name, $object_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsAclsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **model_name** | **string**|  |
 **object_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20034**](../Model/InlineResponse20034.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `objectsAclsPermissionsCreate()`

```php
objectsAclsPermissionsCreate($app_label, $id, $model_name, $object_id, $data): \app\App\Edms\OpenAPI\Client\Models\WritableAccessControlListPermission
```



Add a new permission to the selected access control list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$id = 'id_example'; // string
$model_name = 'model_name_example'; // string
$object_id = 'object_id_example'; // string
$data = new \app\App\Edms\OpenAPI\Client\Models\WritableAccessControlListPermission(); // \app\App\Edms\OpenAPI\Client\Models\WritableAccessControlListPermission

try {
    $result = $apiInstance->objectsAclsPermissionsCreate($app_label, $id, $model_name, $object_id, $data);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsAclsPermissionsCreate: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **id** | **string**|  |
 **model_name** | **string**|  |
 **object_id** | **string**|  |
 **data** | [**\app\App\Edms\OpenAPI\Client\Models\WritableAccessControlListPermission**](../Model/WritableAccessControlListPermission.md)|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\WritableAccessControlListPermission**](../Model/WritableAccessControlListPermission.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `objectsAclsPermissionsDelete()`

```php
objectsAclsPermissionsDelete($app_label, $id, $model_name, $object_id, $permission_pk)
```



Remove the permission from the selected access control list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$id = 'id_example'; // string
$model_name = 'model_name_example'; // string
$object_id = 'object_id_example'; // string
$permission_pk = 'permission_pk_example'; // string

try {
    $apiInstance->objectsAclsPermissionsDelete($app_label, $id, $model_name, $object_id, $permission_pk);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsAclsPermissionsDelete: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **id** | **string**|  |
 **model_name** | **string**|  |
 **object_id** | **string**|  |
 **permission_pk** | **string**|  |

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

## `objectsAclsPermissionsList()`

```php
objectsAclsPermissionsList($app_label, $id, $model_name, $object_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20035
```



Returns the access control list permission list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$id = 'id_example'; // string
$model_name = 'model_name_example'; // string
$object_id = 'object_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->objectsAclsPermissionsList($app_label, $id, $model_name, $object_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsAclsPermissionsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **id** | **string**|  |
 **model_name** | **string**|  |
 **object_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20035**](../Model/InlineResponse20035.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `objectsAclsPermissionsRead()`

```php
objectsAclsPermissionsRead($app_label, $id, $model_name, $object_id, $permission_pk): \app\App\Edms\OpenAPI\Client\Models\AccessControlListPermission
```



Returns the details of the selected access control list permission.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$id = 'id_example'; // string
$model_name = 'model_name_example'; // string
$object_id = 'object_id_example'; // string
$permission_pk = 'permission_pk_example'; // string

try {
    $result = $apiInstance->objectsAclsPermissionsRead($app_label, $id, $model_name, $object_id, $permission_pk);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsAclsPermissionsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **id** | **string**|  |
 **model_name** | **string**|  |
 **object_id** | **string**|  |
 **permission_pk** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\AccessControlListPermission**](../Model/AccessControlListPermission.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `objectsAclsRead()`

```php
objectsAclsRead($app_label, $id, $model_name, $object_id): \app\App\Edms\OpenAPI\Client\Models\AccessControlList
```



Returns the details of the selected access control list.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$id = 'id_example'; // string
$model_name = 'model_name_example'; // string
$object_id = 'object_id_example'; // string

try {
    $result = $apiInstance->objectsAclsRead($app_label, $id, $model_name, $object_id);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsAclsRead: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **id** | **string**|  |
 **model_name** | **string**|  |
 **object_id** | **string**|  |

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\AccessControlList**](../Model/AccessControlList.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `objectsEventsList()`

```php
objectsEventsList($app_label, $model, $object_id, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20024
```



Return a list of events for the specified object.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$model = 'model_example'; // string
$object_id = 'object_id_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->objectsEventsList($app_label, $model, $object_id, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsEventsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **model** | **string**|  |
 **object_id** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20024**](../Model/InlineResponse20024.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)

## `objectsPermissionsList()`

```php
objectsPermissionsList($app_label, $model_name, $page): \app\App\Edms\OpenAPI\Client\Models\InlineResponse20033
```



Returns a list of all the available permissions for a class.

### Example

```php
<?php
require_once(__DIR__ . '/vendor/autoload.php');


// Configure HTTP basic authorization: Basic
$config = OpenAPI\Client\Configuration::getDefaultConfiguration()
              ->setUsername('YOUR_USERNAME')
              ->setPassword('YOUR_PASSWORD');


$apiInstance = new App\Edms\OpenAPI\Client\ApiObjectsApi(
    // If you want use custom http client, pass your client which implements `GuzzleHttp\ClientInterface`.
    // This is optional, `GuzzleHttp\Client` will be used as default.
    new GuzzleHttp\Client(),
    $config
);
$app_label = 'app_label_example'; // string
$model_name = 'model_name_example'; // string
$page = 56; // int | A page number within the paginated result set.

try {
    $result = $apiInstance->objectsPermissionsList($app_label, $model_name, $page);
    print_r($result);
} catch (Exception $e) {
    echo 'Exception when calling ObjectsApi->objectsPermissionsList: ', $e->getMessage(), PHP_EOL;
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **app_label** | **string**|  |
 **model_name** | **string**|  |
 **page** | **int**| A page number within the paginated result set. | [optional]

### Return type

[**\app\App\Edms\OpenAPI\Client\Models\InlineResponse20033**](../Model/InlineResponse20033.md)

### Authorization

[Basic](../../README.md#Basic)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

[[Back to top]](#) [[Back to API list]](../../README.md#endpoints)
[[Back to Model list]](../../README.md#models)
[[Back to README]](../../README.md)
