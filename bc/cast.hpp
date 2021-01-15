/*
 * Copyright 2019-2021 Hans-Kristian Arntzen for Valve Corporation
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
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
