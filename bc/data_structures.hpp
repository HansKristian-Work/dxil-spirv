/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
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

#include "thread_local_allocator.hpp"

namespace LLVMBC
{
template <typename T>
using Vector = dxil_spv::Vector<T>;
template <typename T>
using UnorderedSet = dxil_spv::UnorderedSet<T>;
template <typename Key, typename Value>
using UnorderedMap = dxil_spv::UnorderedMap<Key, Value>;
using String = dxil_spv::String;
using StringStream = dxil_spv::StringStream;
}