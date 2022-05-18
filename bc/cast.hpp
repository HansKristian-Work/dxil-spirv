/* Copyright (c) 2019-2022 Hans-Kristian Arntzen for Valve Corporation
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


#pragma once

#include "logging.hpp"
#include "metadata.hpp"
#include "type.hpp"
#include "value.hpp"
#include <exception>

namespace LLVMBC
{
struct ModuleParseContext;

template <typename T>
inline T *cast(Type *type)
{
	if (type->getTypeID() != T::get_type_id())
	{
		LOGE("Invalid type ID in cast<T>.\n");
		std::terminate();
	}
	return static_cast<T *>(type);
}

template <typename T>
inline const T *cast(const Type *type)
{
	if (type->getTypeID() != T::get_type_id())
	{
		LOGE("Invalid type ID in cast<T>.\n");
		std::terminate();
	}
	return static_cast<const T *>(type);
}

template <typename T>
inline T *dyn_cast(Type *type)
{
	if (!type)
		return nullptr;

	if (type->getTypeID() != T::get_type_id())
		return nullptr;
	else
		return static_cast<T *>(type);
}

template <typename T>
inline const T *dyn_cast(const Type *type)
{
	if (!type)
		return nullptr;

	if (type->getTypeID() != T::get_type_id())
		return nullptr;
	else
		return static_cast<const T *>(type);
}

template <typename T>
inline bool isa(const Type *type)
{
	return type->getTypeID() == T::get_type_id();
}

class ValueProxy : public Value
{
public:
	static constexpr ValueKind get_value_kind()
	{
		return ValueKind::Proxy;
	}
	ValueProxy(Type *type, ModuleParseContext &context, uint64_t id);

	Value *get_proxy_value() const;
	bool resolve();

	LLVMBC_DEFAULT_VALUE_KIND_IMPL

private:
	uint64_t id;
	ModuleParseContext &context;
	Value *proxy = nullptr;
};

namespace Internal
{
inline Value *resolve_proxy(Value *value);
inline const Value *resolve_proxy(const Value *value);
} // namespace Internal

template <typename T>
inline T *cast(Value *value)
{
	if (T::get_value_kind() != ValueKind::Proxy)
		value = Internal::resolve_proxy(value);

	if (T::is_base_of_value_kind(value->get_value_kind()))
		return static_cast<T *>(value);
	else
	{
		LOGE("Invalid type ID in cast<T>.\n");
		std::terminate();
	}
}

template <typename T>
inline const T *cast(const Value *value)
{
	if (T::get_value_kind() != ValueKind::Proxy)
		value = Internal::resolve_proxy(value);

	if (T::is_base_of_value_kind(value->get_value_kind()))
		return static_cast<const T *>(value);
	else
	{
		LOGE("Invalid type ID in cast<T>.\n");
		std::terminate();
	}
}

template <typename T>
inline T *dyn_cast(Value *value)
{
	if (!value)
		return nullptr;

	if (T::get_value_kind() != ValueKind::Proxy)
		value = Internal::resolve_proxy(value);

	if (T::is_base_of_value_kind(value->get_value_kind()))
		return static_cast<T *>(value);
	else
		return nullptr;
}

template <typename T>
inline const T *dyn_cast(const Value *value)
{
	if (!value)
		return nullptr;

	if (T::get_value_kind() != ValueKind::Proxy)
		value = Internal::resolve_proxy(value);

	if (T::is_base_of_value_kind(value->get_value_kind()))
		return static_cast<const T *>(value);
	else
		return nullptr;
}

template <typename T>
inline bool isa(const Value *value)
{
	if (T::get_value_kind() != ValueKind::Proxy)
		value = Internal::resolve_proxy(value);

	return T::is_base_of_value_kind(value->get_value_kind());
}

namespace Internal
{
inline Value *resolve_proxy(Value *value)
{
	while (value && value->get_value_kind() == ValueKind::Proxy)
		value = cast<ValueProxy>(value)->get_proxy_value();
	return value;
}

inline const Value *resolve_proxy(const Value *value)
{
	while (value && value->get_value_kind() == ValueKind::Proxy)
		value = cast<ValueProxy>(value)->get_proxy_value();
	return value;
}
} // namespace Internal

template <typename T>
inline T *cast(MDOperand &md)
{
	if (md.get_metadata_kind() == T::get_metadata_kind())
		return static_cast<T *>(&md);
	else
	{
		LOGE("Invalid type ID in cast<T>.\n");
		std::terminate();
	}
}

template <typename T>
inline T *cast(MDOperand *md)
{
	if (md->get_metadata_kind() == T::get_metadata_kind())
		return static_cast<T *>(md);
	else
	{
		LOGE("Invalid type ID in cast<T>.\n");
		std::terminate();
	}
}

template <typename T>
inline const T *cast(const MDOperand &md)
{
	if (md.get_metadata_kind() == T::get_metadata_kind())
		return static_cast<const T *>(&md);
	else
	{
		LOGE("Invalid type ID in cast<T>.\n");
		std::terminate();
	}
}

template <typename T>
inline const T *cast(const MDOperand *md)
{
	if (md->get_metadata_kind() == T::get_metadata_kind())
		return static_cast<const T *>(md);
	else
	{
		LOGE("Invalid type ID in cast<T>.\n");
		std::terminate();
	}
}

template <typename T>
inline T *dyn_cast(MDOperand &md)
{
	if (md.get_metadata_kind() == T::get_metadata_kind())
		return static_cast<T *>(&md);
	else
		return nullptr;
}

template <typename T>
inline T *dyn_cast(MDOperand *md)
{
	if (!md)
		return nullptr;

	if (md->get_metadata_kind() == T::get_metadata_kind())
		return static_cast<T *>(md);
	else
		return nullptr;
}

template <typename T>
inline const T *dyn_cast(const MDOperand &md)
{
	if (md.get_metadata_kind() == T::get_metadata_kind())
		return static_cast<const T *>(&md);
	else
		return nullptr;
}

template <typename T>
inline const T *dyn_cast(const MDOperand *md)
{
	if (!md)
		return nullptr;

	if (md->get_metadata_kind() == T::get_metadata_kind())
		return static_cast<const T *>(md);
	else
		return nullptr;
}

template <typename T>
inline bool isa(const MDOperand &md)
{
	return md.get_metadata_kind() == T::get_metadata_kind();
}

template <typename T>
inline bool isa(const MDOperand *md)
{
	return md->get_metadata_kind() == T::get_metadata_kind();
}

} // namespace LLVMBC
